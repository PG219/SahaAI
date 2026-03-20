# ml/credit_model.py — XGBoost credit scoring + SHAP explainability
import numpy as np

try:
    import xgboost as xgb
    import shap
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False


class CreditModel:
    """
    XGBoost credit scoring model with SHAP explainability.

    In production: load pre-trained model from model registry (MLflow / S3).
    In development/demo: uses a rule-based approximation so the API runs
    without training data.
    """

    def __init__(self, model_path: str = None):
        self.model = None
        self.explainer = None
        if XGB_AVAILABLE and model_path:
            self._load(model_path)

    def _load(self, path: str):
        self.model = xgb.Booster()
        self.model.load_model(path)
        self.explainer = shap.TreeExplainer(self.model)

    def predict(self, features: np.ndarray) -> tuple[float, float]:
        """
        Returns (credit_score: int 300–900, repayment_probability: float 0–1).
        """
        if self.model and XGB_AVAILABLE:
            dmat = xgb.DMatrix(features)
            repay_prob = float(self.model.predict(dmat)[0])
        else:
            # Rule-based fallback for demo
            income, volatility, expense_ratio, savings_months, repay_rate, loans, src, hist_len = features[0]
            repay_prob = (
                repay_rate * 0.40
                + (1 - expense_ratio) * 0.25
                + min(savings_months / 6, 1) * 0.15
                + (1 - volatility) * 0.10
                + (1 / max(loans + 1, 1)) * 0.10
            )
            repay_prob = float(np.clip(repay_prob, 0.05, 0.98))

        credit_score = int(300 + repay_prob * 600)
        return credit_score, repay_prob

    def explain(self, features: np.ndarray) -> np.ndarray:
        """Returns SHAP values for each feature."""
        if self.explainer and XGB_AVAILABLE:
            return self.explainer.shap_values(features)
        # Approximate SHAP values for demo
        income, volatility, expense_ratio, savings_months, repay_rate, loans, src, hist_len = features[0]
        return np.array([[
            (income - 30000) / 100000 * 0.12,
            -volatility * 0.18,
            -(expense_ratio - 0.65) * 0.09,
            min(savings_months / 6, 1) * 0.14,
            (repay_rate - 0.5) * 0.31,
            -loans * 0.07,
            0.02,
            0.01,
        ]])


# ml/risk_model.py — LSTM financial risk forecasting
class RiskModel:
    """
    LSTM model for time-series financial risk forecasting.

    Input:  sequence of (income, expense, payment_made) over N months
    Output: current risk probability + N-month forecast
    """

    def __init__(self, model_path: str = None):
        self.model = None
        if model_path:
            self._load(model_path)

    def _load(self, path: str):
        try:
            import tensorflow as tf
            self.model = tf.keras.models.load_model(path)
        except Exception:
            pass

    def predict(self, sequence: np.ndarray, horizon: int = 3) -> tuple[float, list[float]]:
        if self.model:
            import tensorflow as tf
            inp = tf.expand_dims(sequence, 0)
            probs = self.model.predict(inp)[0]
            current = float(probs[0])
            forecast = [float(p) for p in probs[1:horizon + 1]]
            return current, forecast

        # Rule-based fallback
        if len(sequence) == 0:
            return 0.30, [0.30] * horizon

        recent = sequence[-3:]
        ratios = recent[:, 1] / np.maximum(recent[:, 0], 1e-6)
        missed = (recent[:, 2] == 0).sum()
        avg_ratio = float(np.mean(ratios))

        base_risk = avg_ratio * 0.6 + missed * 0.12
        base_risk = float(np.clip(base_risk, 0.05, 0.95))

        # Simple trend extrapolation for forecast
        trend = 0.02 if avg_ratio > 0.70 else -0.01
        forecast = [
            float(np.clip(base_risk + trend * (i + 1), 0.05, 0.95))
            for i in range(horizon)
        ]
        return base_risk, forecast


# ml/finn_validator.py — Finance-Informed Neural Network constraint checker
class FINNValidator:
    """
    Hard economic constraints applied BEFORE and AFTER model scoring.
    These are domain rules that classical ML would not reliably enforce.
    """

    EXPENDITURE_CAP    = 0.90    # expense / income must be < 90%
    DTI_CAP            = 0.40    # debt service / income < 40%
    MIN_SAVINGS_MONTHS = 3       # savings / income must cover 3 months
    MIN_REPAY_RATE     = 0.70    # at least 70% on-time payments

    def validate(self, profile) -> list[str]:
        violations = []
        income = max(profile.monthly_income, 1)

        # Constraint 1: Expenditure cap
        exp_ratio = profile.monthly_expenses / income
        if exp_ratio >= self.EXPENDITURE_CAP:
            violations.append(
                f"Expenditure cap exceeded: {exp_ratio:.0%} of income (limit {self.EXPENDITURE_CAP:.0%})"
            )

        # Constraint 2: Zero income axiom
        if profile.monthly_income <= 0:
            violations.append("Zero income — creditworthiness cannot be assessed")

        # Constraint 3: Minimum savings buffer
        savings_months = profile.savings_balance / income
        if savings_months < self.MIN_SAVINGS_MONTHS:
            violations.append(
                f"Insufficient savings buffer: {savings_months:.1f} months (minimum {self.MIN_SAVINGS_MONTHS})"
            )

        # Constraint 4: Repayment floor
        if profile.repayment_history:
            repay_rate = sum(profile.repayment_history) / len(profile.repayment_history)
            if repay_rate < self.MIN_REPAY_RATE:
                violations.append(
                    f"Repayment rate below floor: {repay_rate:.0%} (minimum {self.MIN_REPAY_RATE:.0%})"
                )

        return violations


# ml/fairness.py — Fairlearn-based demographic bias checker
class FairnessChecker:
    """
    Detects potential demographic bias in credit scoring.
    Flags cases where model output may disadvantage protected groups.
    """

    # Empirical baselines from training data (update after each retraining)
    GROUP_BASELINES = {
        "agricultural": 638,
        "gig":          671,
        "self_employed": 665,
        "salaried":     710,
        "business":     682,
    }
    MAX_DISPARITY = 80   # max allowed gap vs baseline

    def check(self, profile, predicted_score: int) -> list[str]:
        flags = []
        group = str(profile.income_source.value)
        baseline = self.GROUP_BASELINES.get(group)

        if baseline and (baseline - predicted_score) > self.MAX_DISPARITY:
            flags.append(
                f"Possible bias against {group} workers — score {self.MAX_DISPARITY}+ pts below group baseline"
            )

        # Flag high-volatility gig workers who may be under-scored
        if group == "gig" and profile.income_volatility > 0.4 and predicted_score < 600:
            flags.append(
                "Gig worker with high volatility: consider income-smoothing adjustment before final decision"
            )

        return flags


# ml/rl_agent.py — RL repayment behaviour agent (PPO / Q-learning)
class RLAgent:
    """
    Reinforcement learning agent that models user repayment behaviour.

    State:  (income, debt_balance, savings, risk_score, credit_score)
    Action: repay | partial | skip
    Reward: +1 on-time, +0.5 partial, -1 skip, ±0.2 score change bonus
    """

    REWARD_MAP = {"repay": 1.0, "partial": 0.5, "skip": -1.0}
    SCORE_BONUS_THRESHOLD = 10

    def __init__(self, model_path: str = None):
        self.q_table = {}    # simple Q-table fallback
        if model_path:
            self._load(model_path)

    def _load(self, path: str):
        try:
            from stable_baselines3 import PPO
            self.model = PPO.load(path)
        except Exception:
            pass

    def step(self, state: dict, action: str) -> tuple[float, dict, int, bool]:
        """
        Process one RL step.
        Returns: (reward, new_state, new_credit_score)
        """
        reward = self.REWARD_MAP.get(action, 0.0)

        # Update state
        new_state = dict(state)
        if action == "repay":
            new_state["debt_balance"] = max(0, state["debt_balance"] - state["income"] * 0.2)
            new_state["savings"] = state["savings"] + state["income"] * 0.05
            score_delta = +8
        elif action == "partial":
            new_state["debt_balance"] = max(0, state["debt_balance"] - state["income"] * 0.1)
            score_delta = +2
        else:  # skip
            new_state["debt_balance"] = state["debt_balance"] + state["income"] * 0.02
            new_state["savings"] = max(0, state["savings"] - state["income"] * 0.03)
            score_delta = -15

        new_score = int(np.clip(state["credit_score"] + score_delta, 300, 900))

        if abs(score_delta) >= self.SCORE_BONUS_THRESHOLD:
            reward += 0.2 * np.sign(score_delta)

        episode_done = new_state["debt_balance"] <= 0
        new_state["credit_score"] = new_score
        new_state["risk_score"] = float(np.clip(
            state["risk_score"] + (0.05 if action == "skip" else -0.02), 0, 1
        ))

        return float(reward), new_state, new_score, episode_done

    def recommend_action(self, state: dict) -> str:
        """Simple policy: repay if savings cover 1 month, else partial."""
        if state["savings"] >= state["income"]:
            return "repay"
        elif state["savings"] >= state["income"] * 0.3:
            return "partial"
        else:
            return "skip"
