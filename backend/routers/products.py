# routers/products.py — Product recommendation engine
from fastapi import APIRouter
from backend.schemas import ProductRequest, ProductResponse, ProductMatch

router = APIRouter()

# Indian government financial schemes catalog
PRODUCT_CATALOG = [
    {
        "product_id": "SVANidhi",
        "name": "PM SVANidhi",
        "type": "Micro Loan",
        "amount_inr": "₹50,000",
        "interest_rate": "7%",
        "term_months": 12,
        "govt_backed": True,
        "description": "Street vendor & gig worker micro-credit scheme",
        "min_score": 0,
        "max_risk": 80,
        "income_sources": ["gig", "self_employed", "agricultural"],
        "base_eligibility": 80,
    },
    {
        "product_id": "JanSamarth",
        "name": "Jan Samarth Portal",
        "type": "Personal Loan",
        "amount_inr": "₹1,50,000",
        "interest_rate": "10.5%",
        "term_months": 24,
        "govt_backed": True,
        "description": "National credit guarantee scheme for formal workers",
        "min_score": 600,
        "max_risk": 55,
        "income_sources": ["salaried", "business", "self_employed"],
        "base_eligibility": 70,
    },
    {
        "product_id": "PMJJBY",
        "name": "PM Jeevan Jyoti Bima",
        "type": "Life Insurance",
        "amount_inr": "₹2,00,000",
        "interest_rate": "₹436/yr",
        "term_months": 12,
        "govt_backed": True,
        "description": "Life insurance for informal sector workers",
        "min_score": 0,
        "max_risk": 100,
        "income_sources": ["gig", "agricultural", "self_employed", "salaried", "business"],
        "base_eligibility": 95,
    },
    {
        "product_id": "MUDRA",
        "name": "MUDRA Yojana — Tarun",
        "type": "Business Loan",
        "amount_inr": "₹3,00,000",
        "interest_rate": "8.5%",
        "term_months": 36,
        "govt_backed": True,
        "description": "Micro-unit development & refinance — for small businesses",
        "min_score": 580,
        "max_risk": 65,
        "income_sources": ["self_employed", "business", "agricultural"],
        "base_eligibility": 60,
    },
    {
        "product_id": "PMSBY",
        "name": "PM Suraksha Bima",
        "type": "Accident Insurance",
        "amount_inr": "₹2,00,000",
        "interest_rate": "₹20/yr",
        "term_months": 12,
        "govt_backed": True,
        "description": "Accident insurance for informal workers",
        "min_score": 0,
        "max_risk": 100,
        "income_sources": ["gig", "agricultural", "self_employed", "salaried", "business"],
        "base_eligibility": 98,
    },
]


def _score_eligibility(product: dict, credit_score: int, risk_pct: float, income_source: str) -> float:
    """Compute personalised eligibility score 0–100."""
    score = product["base_eligibility"]

    if credit_score < product["min_score"]:
        gap = product["min_score"] - credit_score
        score -= min(gap / 5, 30)

    if risk_pct > product["max_risk"]:
        score -= 10

    if income_source in product["income_sources"]:
        score += 5

    return round(max(0, min(100, score)), 1)


@router.post("/recommend", response_model=ProductResponse)
def recommend_products(req: ProductRequest):
    p = req.profile
    income_source = p.income_source.value

    matches = []
    for product in PRODUCT_CATALOG:
        elig = _score_eligibility(product, req.credit_score, req.risk_pct, income_source)
        matches.append(ProductMatch(
            product_id=product["product_id"],
            name=product["name"],
            type=product["type"],
            amount_inr=product["amount_inr"],
            interest_rate=product["interest_rate"],
            term_months=product["term_months"],
            eligibility_pct=elig,
            govt_backed=product["govt_backed"],
            description=product["description"],
        ))

    # Sort by eligibility descending
    matches.sort(key=lambda m: m.eligibility_pct, reverse=True)

    return ProductResponse(user_id=p.user_id, matches=matches)
