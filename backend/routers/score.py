# routers/score.py — Credit scoring endpoint
import numpy as np
from fastapi import APIRouter, HTTPException
try:
    from ..schemas import ScoreRequest, ScoreResponse, ShapFeature
    from ..ml.models import CreditModel, FINNValidator, FairnessChecker
except ImportError:
    from schemas import ScoreRequest, ScoreResponse, ShapFeature
    from ml.models import CreditModel, FINNValidator, FairnessChecker

router = APIRouter()
model     = CreditModel()
finn      = FINNValidator()
fairness  = FairnessChecker()


def _engineer_features(p) -> np.ndarray:
    """Transform UserProfile into model feature vector."""
    repay_rate   = sum(p.repayment_history) / max(len(p.repayment_history), 1)
    expense_ratio = p.monthly_expenses / max(p.monthly_income, 1)
    savings_months = p.savings_balance / max(p.monthly_income, 1)

    income_source_enc = {
        "salaried": 0, "gig": 1, "self_employed": 2,
        "agricultural": 3, "business": 4
    }.get(str(p.income_source.value), 1)

    return np.array([[
        p.monthly_income,
        p.income_volatility,
        expense_ratio,
        savings_months,
        repay_rate,
        p.existing_loan_count,
        income_source_enc,
        len(p.repayment_history),
    ]])


@router.post("/score", response_model=ScoreResponse)
def score_user(req: ScoreRequest):
    p = req.profile

    if not p.repayment_history:
        raise HTTPException(status_code=400, detail="repayment_history must contain at least one month")

    # 1. FINN hard-constraint pre-check
    finn_violations = finn.validate(p)

    # 2. Feature engineering
    features = _engineer_features(p)

    # 3. XGBoost credit score prediction
    score_raw, repay_prob = model.predict(features)

    # 4. SHAP explainability
    shap_values = model.explain(features)
    feature_names = [
        "monthly_income", "income_volatility", "expense_ratio",
        "savings_months", "repayment_rate", "existing_loans",
        "income_source", "history_length",
    ]
    shap_features = [
        ShapFeature(
            feature=name,
            shap_value=round(float(sv), 4),
            direction="positive" if sv >= 0 else "negative",
        )
        for name, sv in sorted(
            zip(feature_names, shap_values[0]),
            key=lambda x: abs(x[1]),
            reverse=True,
        )
    ]

    # 5. Apply FINN penalty to final score
    for _ in finn_violations:
        score_raw = max(300, score_raw - 20)

    # 6. Fairness check
    fairness_flags = fairness.check(p, score_raw)

    # 7. Bucket
    if score_raw >= 750:
        bucket = "low"
    elif score_raw >= 650:
        bucket = "medium"
    elif score_raw >= 550:
        bucket = "high"
    else:
        bucket = "critical"

    return ScoreResponse(
        user_id=p.user_id,
        credit_score=int(score_raw),
        creditworthy=score_raw >= 600,
        risk_bucket=bucket,
        repayment_prob=round(float(repay_prob), 4),
        shap_features=shap_features,
        finn_violations=finn_violations,
        fairness_flags=fairness_flags,
    )
