from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import pandas as pd

MODEL_VERSION = "v2.0.1"
model = joblib.load(f"models/success_predictor_{MODEL_VERSION}.pkl")

app = FastAPI(title="Game Success Predictor API")

# ------------------ INPUT SCHEMA ------------------

class GameInput(BaseModel):
    genre: str
    platform: str
    price: float = Field(ge=0)
    release_year: int = Field(ge=1980, le=2035)
    is_multiplayer: bool
    team_size: int = Field(ge=1, le=500)

# ------------------ API ------------------

@app.post("/predict-success")
def predict_success(data: GameInput):
    years_since_release = max(0, 2026 - data.release_year)

    df = pd.DataFrame([{
        "genre": data.genre,
        "platform": data.platform,
        "price": data.price,
        "years_since_release": years_since_release,
        "team_size": data.team_size,
        "is_multiplayer": int(data.is_multiplayer),

        # placeholders (computed in training distribution)
        "genre_market_share": 0.02,
        "content_scope": 0.0
    }])

    proba = model.predict_proba(df)[0][1]

    return {
        "model_version": MODEL_VERSION,
        "success_probability": round(proba * 100, 2),
        "confidence": (
            "High" if proba > 0.7 else
            "Medium" if proba > 0.45 else
            "Low"
        ),
        "verdict": (
            "Strong Market Fit" if proba > 0.7 else
            "Risky but Possible" if proba > 0.45 else
            "High Risk"
        )
    }
