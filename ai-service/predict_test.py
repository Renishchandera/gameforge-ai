# predict_test.py
import joblib
import pandas as pd

MODEL_PATH = "models/random_forest_binary.pkl"
#MODEL_PATH = "models/decision_tree.pkl"

def load_model():
    print("📦 Loading trained model...")
    return joblib.load(MODEL_PATH)

def predict_game_success(model, game_input):
    """
    game_input: dict with engineered features
    """
    df = pd.DataFrame([game_input])

    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]

    result = {
        "prediction": int(prediction),
        "success_probability": round(float(probabilities[1]) * 100, 2),
        "confidence": (
            "High" if probabilities[1] > 0.7
            else "Medium" if probabilities[1] > 0.4
            else "Low"
        )
    }

    return result

if __name__ == "__main__":
    model = load_model()

    # 👇 Example engineered input (same format backend will send)
    example_game = {
        "genre": "VR",
        "platform": "Console",
        "price": 1000,
        "price_category": "AAA",
        "genre_popularity": 1500,
        "complexity": 3.0
        # "release_month": 6,
        # "years_since_release": 1
    }

    output = predict_game_success(model, example_game)

    print("\n🎯 Prediction Result")
    print("--------------------")
    print(output)
