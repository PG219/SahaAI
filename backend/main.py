# main.py — FinAccess AI FastAPI entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from .routers import score, risk, products, rl, batch, bank, federated
except ImportError:
    from routers import score, risk, products, rl, batch, bank, federated

app = FastAPI(title="FinAccess AI API", version="1.0.0",
    description="Credit scoring, risk prediction, and product recommendation for Indian demographics")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(score.router,     prefix="/api/v1", tags=["Credit Scoring"])
app.include_router(risk.router,      prefix="/api/v1", tags=["Risk Forecast"])
app.include_router(products.router,  prefix="/api/v1", tags=["Product Recommendations"])
app.include_router(rl.router,        prefix="/api/v1", tags=["RL Agent"])
app.include_router(batch.router,     prefix="/api/v1", tags=["Batch Scoring"])
app.include_router(bank.router,      prefix="/api/v1", tags=["Bank Officer"])
app.include_router(federated.router, prefix="/api/v1", tags=["Federated Learning"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "FinAccess AI"}
