# routers/federated.py — Federated learning weight aggregation (FedAvg)
import numpy as np
from fastapi import APIRouter, HTTPException
try:
    from ..schemas import FederatedUpdateRequest, FederatedUpdateResponse
except ImportError:
    from schemas import FederatedUpdateRequest, FederatedUpdateResponse

router = APIRouter()

# In-memory aggregation state (replace with Redis / DB in production)
_rounds: dict[int, list[dict]] = {}
QUORUM = 2   # minimum banks required to aggregate


@router.post("/federated/update", response_model=FederatedUpdateResponse)
def federated_update(req: FederatedUpdateRequest):
    """
    Receive a local model gradient update from one bank.
    When quorum is reached for a round, run FedAvg and return global weights.

    No raw training data ever leaves the originating bank — only weight deltas
    are transmitted, preserving customer privacy.
    """
    if req.num_samples <= 0:
        raise HTTPException(status_code=400, detail="num_samples must be greater than zero")
    if not req.model_weights:
        raise HTTPException(status_code=400, detail="model_weights must not be empty")

    rnd = req.round_number
    if rnd not in _rounds:
        _rounds[rnd] = []

    expected_len = len(_rounds[rnd][0]["weights"]) if _rounds[rnd] else len(req.model_weights)
    if len(req.model_weights) != expected_len:
        raise HTTPException(status_code=400, detail="model_weights length does not match current round")

    _rounds[rnd].append({
        "bank_id":   req.bank_id,
        "weights":   req.model_weights,
        "n_samples": req.num_samples,
    })

    participants = len(_rounds[rnd])

    if participants < QUORUM:
        # Not enough banks yet — return current placeholder global weights
        return FederatedUpdateResponse(
            round_number=rnd,
            global_weights=req.model_weights,
            global_accuracy=0.0,
            participating_banks=participants,
        )

    # FedAvg: weighted average by number of local samples
    total_samples = sum(b["n_samples"] for b in _rounds[rnd])
    weight_len    = len(_rounds[rnd][0]["weights"])

    global_weights = np.zeros(weight_len, dtype=np.float64)
    for bank in _rounds[rnd]:
        w = bank["n_samples"] / total_samples
        global_weights += w * np.array(bank["weights"])

    # Simulated accuracy improvement with more banks
    global_accuracy = round(0.80 + min(participants * 0.02, 0.15), 4)

    # Clear round after aggregation
    del _rounds[rnd]

    return FederatedUpdateResponse(
        round_number=rnd,
        global_weights=global_weights.tolist(),
        global_accuracy=global_accuracy,
        participating_banks=participants,
    )


@router.get("/federated/status")
def federated_status():
    """Return current aggregation round status across all active banks."""
    return {
        "active_rounds":    list(_rounds.keys()),
        "quorum_required":  QUORUM,
        "pending_updates":  {rnd: len(updates) for rnd, updates in _rounds.items()},
    }
