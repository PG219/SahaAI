# routers/rl.py — RL agent endpoint
from fastapi import APIRouter
from backend.schemas import RLStateRequest, RLStateResponse
from ml.models import RLAgent

router = APIRouter()
agent  = RLAgent()


@router.post("/rl/step", response_model=RLStateResponse)
def rl_step(req: RLStateRequest):
    state = {
        "income":       req.income,
        "debt_balance": req.debt_balance,
        "savings":      req.savings,
        "risk_score":   req.risk_score,
        "credit_score": req.credit_score,
    }
    reward, new_state, new_score, done = agent.step(state, req.action)
    advice = agent.recommend_action(new_state)

    return RLStateResponse(
        user_id=req.user_id,
        reward=reward,
        new_state=new_state,
        new_score=new_score,
        episode_done=done,
        policy_advice=f"Recommended next action: {advice}",
    )
