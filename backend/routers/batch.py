# routers/batch.py — Batch scoring for bank officers
import numpy as np
from fastapi import APIRouter
from backend.schemas import BatchRequest, BatchResponse, BatchResultRow
from ml.models import CreditModel, FINNValidator, FairnessChecker

router   = APIRouter()
model    = CreditModel()
finn     = FINNValidator()
fairness = FairnessChecker()

PRODUCT_MAP = {"gig":"PM SVANidhi","agricultural":"PM SVANidhi","self_employed":"MUDRA Yojana","salaried":"Jan Samarth","business":"MUDRA Yojana"}

@router.post("/batch-score", response_model=BatchResponse)
def batch_score(req: BatchRequest):
    results, approved, flagged, group_stats = [], 0, 0, {}
    for row in req.rows:
        repay_list = [int(x) for x in row.repayment_history.split(",") if x.strip()]
        repay_rate = sum(repay_list) / max(len(repay_list), 1)
        expense_ratio = row.monthly_expenses / max(row.monthly_income, 1)
        savings_months = row.savings_balance / max(row.monthly_income, 1)
        features = np.array([[row.monthly_income, row.income_volatility, expense_ratio,
                              savings_months, repay_rate, row.existing_loan_count, 0, len(repay_list)]])
        score_raw, _ = model.predict(features)
        if score_raw >= 650:
            bucket = "low"; approved += 1
        elif score_raw >= 560:
            bucket = "medium"; flagged += 1
        else:
            bucket = "high"; flagged += 1
        group = row.income_source
        if group not in group_stats:
            group_stats[group] = {"count":0,"total_score":0}
        group_stats[group]["count"] += 1
        group_stats[group]["total_score"] += score_raw
        results.append(BatchResultRow(user_id=row.user_id, credit_score=int(score_raw),
            creditworthy=score_raw>=600, risk_bucket=bucket, top_product=PRODUCT_MAP.get(group,"PM SVANidhi")))
    fairness_summary = {g:{"count":s["count"],"avg_score":int(s["total_score"]/s["count"])} for g,s in group_stats.items()}
    return BatchResponse(bank_id=req.bank_id, total=len(results), approved=approved,
                         flagged=flagged, results=results, fairness_summary=fairness_summary)
