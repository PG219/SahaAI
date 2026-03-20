# schemas.py — Pydantic models for FinAccess AI
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class IncomeSource(str, Enum):
    salaried     = "salaried"
    gig          = "gig"
    self_employed = "self_employed"
    agricultural = "agricultural"
    business     = "business"


class UserProfile(BaseModel):
    user_id:             str
    monthly_income:      float = Field(..., gt=0, description="Net monthly income in INR")
    income_source:       IncomeSource
    income_volatility:   float = Field(..., ge=0, le=1, description="Std-dev / mean over 12 months")
    monthly_expenses:    float = Field(..., gt=0)
    savings_balance:     float = Field(..., ge=0)
    existing_loan_count: int   = Field(..., ge=0)
    repayment_history:   List[int] = Field(..., description="1=paid, 0=missed, last 12 months")
    state:               Optional[str] = None
    age:                 Optional[int] = None
    gender:              Optional[str] = None


class ScoreRequest(BaseModel):
    profile: UserProfile


class ShapFeature(BaseModel):
    feature: str
    shap_value: float
    direction: str   # "positive" | "negative"


class ScoreResponse(BaseModel):
    user_id:          str
    credit_score:     int
    creditworthy:     bool
    risk_bucket:      str          # "low" | "medium" | "high" | "critical"
    repayment_prob:   float
    shap_features:    List[ShapFeature]
    finn_violations:  List[str]    # any hard constraints violated
    fairness_flags:   List[str]    # any demographic fairness warnings


class RiskRequest(BaseModel):
    user_id:        str
    history_months: List[dict]    # [{month, income, expense, payment_made}, ...]
    horizon:        int = 3       # months to forecast


class RiskForecast(BaseModel):
    month_offset: int
    risk_pct:     float
    at_risk:      bool


class RiskResponse(BaseModel):
    user_id:         str
    current_risk:    float
    forecast:        List[RiskForecast]
    top_drivers:     List[str]
    recommended_action: str


class ProductRequest(BaseModel):
    profile:     UserProfile
    credit_score: int
    risk_pct:    float


class ProductMatch(BaseModel):
    product_id:   str
    name:         str
    type:         str
    amount_inr:   str
    interest_rate: str
    term_months:  int
    eligibility_pct: float
    govt_backed:  bool
    description:  str


class ProductResponse(BaseModel):
    user_id: str
    matches: List[ProductMatch]


class RLStateRequest(BaseModel):
    user_id:      str
    income:       float
    debt_balance: float
    savings:      float
    risk_score:   float
    credit_score: int
    action:       str    # "repay" | "partial" | "skip"


class RLStateResponse(BaseModel):
    user_id:      str
    reward:       float
    new_state:    dict
    new_score:    int
    episode_done: bool
    policy_advice: str


class BatchRow(BaseModel):
    user_id:            str
    monthly_income:     float
    income_source:      str
    income_volatility:  float
    monthly_expenses:   float
    savings_balance:    float
    existing_loan_count: int
    repayment_history:  str   # comma-separated "1,0,1,1,..."


class BatchRequest(BaseModel):
    rows: List[BatchRow]
    bank_id: str


class BatchResultRow(BaseModel):
    user_id:       str
    credit_score:  int
    creditworthy:  bool
    risk_bucket:   str
    top_product:   str


class BatchResponse(BaseModel):
    bank_id:       str
    total:         int
    approved:      int
    flagged:       int
    results:       List[BatchResultRow]
    fairness_summary: dict


class FederatedUpdateRequest(BaseModel):
    bank_id:        str
    model_weights:  List[float]   # flattened gradient update
    num_samples:    int
    round_number:   int


class FederatedUpdateResponse(BaseModel):
    round_number:       int
    global_weights:     List[float]
    global_accuracy:    float
    participating_banks: int
