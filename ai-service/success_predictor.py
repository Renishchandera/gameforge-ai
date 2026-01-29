import pandas as pd
import numpy as np
import joblib
import json
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, roc_auc_score

MODEL_VERSION = "v2.0.1"
CURRENT_YEAR = 2026


class GameSuccessPredictor:

    # ---------------- LOAD DATA ----------------

    def load_and_prepare_data(self, filepath):
        df = pd.read_csv(filepath)
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

        # ---- PRICE ----
        df["price"] = df.get("price", 0).fillna(0)

        # ---- REVIEWS ----
        df["positive_reviews"] = df.get("positive", 0).fillna(0)
        df["negative_reviews"] = df.get("negative", 0).fillna(0)

        # ---- GENRE ----
        df["genre"] = (
            df.get("genres", "Unknown")
            .fillna("Unknown")
            .astype(str)
            .apply(lambda x: x.split(",")[0].strip())
        )

        # ---- PLATFORM ----
        def platform(row):
            if row.get("windows", False):
                return "PC"
            if row.get("mac", False):
                return "Mac"
            if row.get("linux", False):
                return "Linux"
            return "Unknown"

        df["platform"] = df.apply(platform, axis=1)

        # ---- RELEASE DATE (FIXED) ----
        df["release_date"] = pd.to_datetime(
            df["release_date"],
            errors="coerce"
        )

        df["release_year"] = df["release_date"].dt.year
        df["years_since_release"] = CURRENT_YEAR - df["release_year"]
        df["years_since_release"] = df["years_since_release"].fillna(
            df["years_since_release"].median()
        ).clip(lower=0)

        return self._create_labels(self._engineer_features(df))

    # ---------------- LABELS ----------------

    def _create_labels(self, df):
        df["total_reviews"] = df["positive_reviews"] + df["negative_reviews"]
        df["review_ratio"] = df["positive_reviews"] / (df["total_reviews"] + 1)
        df["log_reviews"] = np.log1p(df["total_reviews"])

        df["genre_review_pct"] = df.groupby("genre")["log_reviews"].rank(pct=True)
        df["genre_rating_pct"] = df.groupby("genre")["review_ratio"].rank(pct=True)

        df["success_score"] = (
            0.6 * df["genre_review_pct"] +
            0.4 * df["genre_rating_pct"]
        )

        # ---- DYNAMIC THRESHOLD (CRITICAL FIX) ----
        threshold = df["success_score"].quantile(0.75)
        df["success_binary"] = (df["success_score"] >= threshold).astype(int)

        print("Success distribution:")
        print(df["success_binary"].value_counts(normalize=True))

        return df

    # ---------------- FEATURES ----------------

    def _engineer_features(self, df):
        genre_share = df["genre"].value_counts(normalize=True)
        df["genre_market_share"] = df["genre"].map(genre_share)

        df["content_scope"] = (
            0.5 * np.log1p(df["price"]) +
            0.5 * np.log1p(df.get("average_playtime_forever", 0) + 1)
        )

        df["team_size"] = df.get("developers", "").apply(
            lambda x: max(1, len(str(x).split(",")))
        )

        df["is_multiplayer"] = df.get("categories", "").str.contains(
            "Multiplayer", case=False, na=False
        ).astype(int)

        return df

    # ---------------- PIPELINE ----------------

    def build_pipeline(self, calibrate=True):
        categorical = ["genre", "platform"]
        numeric = [
            "price",
            "years_since_release",
            "genre_market_share",
            "content_scope",
            "team_size",
            "is_multiplayer",
        ]

        preprocessor = ColumnTransformer([
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), numeric),

            ("cat", Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore"))
            ]), categorical)
        ])

        base_model = RandomForestClassifier(
            n_estimators=300,
            max_depth=10,
            class_weight="balanced",
            random_state=42
        )

        classifier = (
            CalibratedClassifierCV(base_model, method="sigmoid", cv=3)
            if calibrate else base_model
        )

        return Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", classifier)
        ])

    # ---------------- TRAIN ----------------

    def train_and_save(self, df, output_dir="models"):
        os.makedirs(output_dir, exist_ok=True)

        features = [
            "genre",
            "platform",
            "price",
            "years_since_release",
            "genre_market_share",
            "content_scope",
            "team_size",
            "is_multiplayer"
        ]

        X = df[features]
        y = df["success_binary"]

        if y.nunique() < 2:
            raise RuntimeError("❌ Only one class found in labels. Cannot train classifier.")

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42
        )

        pipeline = self.build_pipeline(calibrate=True)
        pipeline.fit(X_train, y_train)

        preds = pipeline.predict(X_test)
        probas = pipeline.predict_proba(X_test)[:, 1]

        print("Accuracy:", accuracy_score(y_test, preds))
        print("ROC AUC:", roc_auc_score(y_test, probas))

        joblib.dump(
            pipeline,
            f"{output_dir}/success_predictor_{MODEL_VERSION}.pkl"
        )

        with open(f"{output_dir}/metadata_{MODEL_VERSION}.json", "w") as f:
            json.dump({
                "model_version": MODEL_VERSION,
                "features": features
            }, f, indent=2)


# ---------------- MAIN ----------------

if __name__ == "__main__":
    predictor = GameSuccessPredictor()
    df = predictor.load_and_prepare_data("data/steam_games.csv")
    predictor.train_and_save(df)
