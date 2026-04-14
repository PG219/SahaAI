# routers/risk.py — Financial risk forecasting (LSTM)
import numpy as np
from fastapi import APIRouter
from backend.schemas import RiskRequest, RiskResponse, RiskForecast
from ml.models import RiskModel

router = APIRouter()
model  = RiskModel()

THRESHOLD = 0.40   # 40% risk = distress alert


def _top_drivers(history: list) -> list[str]:
    drivers = []
    incomes   = [m.get("income", 0) for m in history]
    expenses  = [m.get("expense", 0) for m in history]
    payments  = [m.get("payment_made", 1) for m in history]

    if len(incomes) >= 2:
        recent_drop = (incomes[-3] - incomes[-1]) / max(incomes[-3], 1)
        if recent_drop > 0.15:
            drivers.append("Significant recent income drop")

    avg_ratio = np.mean([e / max(i, 1) for e, i in zip(expenses, incomes)])
    if avg_ratio > 0.75:
        drivers.append("High expense-to-income ratio")

    missed = payments.count(0)
    if missed >= 2:
        drivers.append(f"Irregular repayments ({missed} missed in window)")

    if len(incomes) >= 3:
        vol = np.std(incomes[-6:]) / max(np.mean(incomes[-6:]), 1)
        if vol > 0.25:
            drivers.append("High income volatility")

    return drivers[:4]


@router.post("/predict-risk", response_model=RiskResponse)
def predict_risk(req: RiskRequest):
    # Prepare time-series input for LSTM
    sequence = np.array([[
        m.get("income", 0),
        m.get("expense", 0),
        m.get("payment_made", 1),
    ] for m in req.history_months], dtype=np.float32)

    # Normalise
    sequence[:, 0] /= 100000   # income normalised to 1 lakh
    sequence[:, 1] /= 100000

    current_risk, forecast_probs = model.predict(sequence, horizon=req.horizon)

    forecast = [
        RiskForecast(
            month_offset=i + 1,
            risk_pct=round(float(p) * 100, 1),
            at_risk=p >= THRESHOLD,
        )
        for i, p in enumerate(forecast_probs)
    ]

    drivers = _top_drivers(req.history_months)

    if current_risk >= 0.60:
        action = "Immediate intervention: recommend income diversification and expense audit"
    elif current_risk >= 0.40:
        action = "Proactive outreach: offer restructuring or micro-insurance product"
    else:
        action = "Monitor monthly; no immediate action required"

    return RiskResponse(
        user_id=req.user_id,
        current_risk=round(float(current_risk) * 100, 1),
        forecast=forecast,
        top_drivers=drivers,
        recommended_action=action,
    )
