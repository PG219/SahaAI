# routers/bank.py — Bank officer portfolio and applicant actions
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ApplicantAction(BaseModel):
    applicant_id: str
    action: str
    officer_id: str
    notes: Optional[str] = None

class PortfolioStats(BaseModel):
    bank_id: str
    total_applicants: int
    active_loans: int
    avg_credit_score: float
    npa_rate: float
    risk_distribution: dict

@router.post("/bank/action")
def take_action(req: ApplicantAction):
    return {"applicant_id":req.applicant_id,"action":req.action,"officer_id":req.officer_id,
            "status":"logged","audit_id":f"AUD-{req.applicant_id}-{req.officer_id}"}

@router.get("/bank/portfolio/{bank_id}", response_model=PortfolioStats)
def get_portfolio(bank_id: str):
    return PortfolioStats(bank_id=bank_id, total_applicants=2847, active_loans=1203,
        avg_credit_score=664.2, npa_rate=2.4,
        risk_distribution={"low":42,"medium":35,"high":15,"critical":8})
