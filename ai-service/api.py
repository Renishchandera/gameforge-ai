from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Load trained model ONCE
model = joblib.load("models/random_forest_binary.pkl")

class GameInput(BaseModel):
    genre: str
    platform: str
    price: float
    price_category: str
    genre_popularity: int
    complexity: float

@app.post("/predict-success")
def predict_success(data: GameInput):
    df = pd.DataFrame([data.dict()])
    proba = model.predict_proba(df)[0][1]

    return {
        "success_probability": round(proba * 100, 2),
        "risk_level": (
            "Low" if proba > 0.7 else
            "Medium" if proba > 0.4 else
            "High"
        )
    }
