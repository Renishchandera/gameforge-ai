# success_predictor.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
from sklearn.impute import SimpleImputer
import joblib
import json

class GameSuccessPredictor:
    def __init__(self):
        self.models = {}
        self.feature_encoder = None
        self.scaler = None
        
    def load_and_prepare_data(self, filepath="data/steam_games.csv"):
        """Load and prepare dataset"""
        print("📊 Loading dataset...")
        df = pd.read_csv(filepath)
        
        # Clean data
        df = self._clean_data(df)
        
        # Create success labels (3 classes)
        df = self._create_success_labels(df)
        
        # Feature engineering
        df = self._engineer_features(df)
        
        return df
    
    def _clean_data(self, df):
        """Clean and normalize dataset columns"""

        # ---------- STANDARDIZE COLUMN NAMES ----------
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

        # ---------- PRICE ----------
        if 'price' in df.columns:
            df['price'] = df['price'].fillna(0)
        else:
            df['price'] = 0

        # ---------- REVIEWS ----------
        if 'positive' in df.columns:
            df['positive_reviews'] = df['positive']
        else:
            df['positive_reviews'] = 0

        if 'negative' in df.columns:
            df['negative_reviews'] = df['negative']
        else:
            df['negative_reviews'] = 0

        # ---------- GENRE (SAFE HANDLING) ----------
        if 'genres' in df.columns:
            df['genres'] = df['genres'].fillna('Unknown').astype(str)
            df['genre'] = df['genres'].apply(
                lambda x: x.split(',')[0].strip() if x.lower() != 'unknown' else 'Unknown'
            )
        else:
            df['genre'] = 'Unknown'


        # ---------- PLATFORM ----------
        def detect_platform(row):
            if row.get('windows', False):
                return 'PC'
            if row.get('mac', False):
                return 'Mac'
            if row.get('linux', False):
                return 'Linux'
            return 'Unknown'

        df['platform'] = df.apply(detect_platform, axis=1)

        # ---------- RELEASE DATE ----------
        if 'release_date' in df.columns:
            df['release_date'] = pd.to_datetime(df['release_date'], errors='coerce')
            df['release_year'] = df['release_date'].dt.year
            df['release_month'] = df['release_date'].dt.month

        return df

    
    def _create_success_labels(self, df):
        """
        Create genre-relative success labels using composite scoring
        """
        # ---- BASIC METRICS ----
        df["total_reviews"] = df["positive_reviews"] + df["negative_reviews"]
        df["review_ratio"] = df["positive_reviews"] / (df["total_reviews"] + 1)
        # Log scale reviews (prevents old AAA dominance)
        df["log_reviews"] = np.log1p(df["total_reviews"])
        # ---- GENRE-RELATIVE NORMALIZATION ----
        df["genre_review_percentile"] = df.groupby("genre")["log_reviews"].rank(pct=True)
        df["genre_rating_percentile"] = df.groupby("genre")["review_ratio"].rank(pct=True)
        # ---- COMPOSITE SUCCESS SCORE ----
        df["success_score"] = (
            0.6 * df["genre_review_percentile"] +
            0.4 * df["genre_rating_percentile"]
        )
        # ---- DEFINE CLASSES ----
        df["success_class"] = pd.cut(
            df["success_score"],
            bins=[-1, 0.4, 0.7, 1.0],
            labels=[0, 1, 2]
        ).astype(int)
        # Binary version (for simpler models)
        df["success_binary"] = (df["success_class"] == 2).astype(int)
        print("📈 Genre-relative success distribution:")
        print(df["success_class"].value_counts())
        print(f"Binary success rate: {df['success_binary'].mean():.2%}")
        return df

    
    def _engineer_features(self, df):
        """Create additional features"""
        # Price categories
        df['price_category'] = pd.cut(df['price'], 
                                      bins=[-1, 0, 5, 15, 30, 1000], 
                                      labels=['Free', 'Cheap', 'Mid', 'Premium', 'AAA'])
        
        # Genre popularity (count of games in same genre)
        genre_counts = df['genre'].value_counts()
        df['genre_popularity'] = df['genre'].map(genre_counts)
        
        # Release recency
        if 'release_year' in df.columns:
            current_year = 2024
            df['years_since_release'] = current_year - df['release_year']
        
        # Simple complexity estimate (price as proxy for content)
        df['complexity'] = np.log1p(df['price'])  # Log price as complexity proxy
        
        return df
    
    def prepare_features(self, df):
        """Prepare feature matrix"""
        # Select features
        features = [
            'genre',           # Categorical
            'platform',        # Categorical  
            'price',           # Numerical
            'price_category',  # Categorical
            'genre_popularity',# Numerical
            'complexity'       # Numerical
        ]
     
        X = df[features]
        
        # Define targets
        y_multi = df['success_class']  # 3 classes
        y_binary = df['success_binary']  # 2 classes
        
        return X, y_multi, y_binary
    
    def build_pipeline(self, df):
        """Build preprocessing and modeling pipeline"""

        categorical_features = ['genre', 'platform', 'price_category']
        numerical_features = ['price', 'genre_popularity', 'complexity']

        # if 'release_month' in df.columns:
        #     numerical_features.extend(['release_month', 'years_since_release'])

        # ---- NUMERIC PIPELINE ----
        numeric_pipeline = Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])

        # ---- CATEGORICAL PIPELINE ----
        categorical_pipeline = Pipeline([
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])

        preprocessor = ColumnTransformer([
            ('num', numeric_pipeline, numerical_features),
            ('cat', categorical_pipeline, categorical_features)
        ])

        return preprocessor

    
    def train_models(self, df, test_size=0.2):
        """Train multiple models"""
        print("🤖 Training models...")
        
        # Prepare features
        X, y_multi, y_binary = self.prepare_features(df)
        
        # Split data
        X_train, X_test, y_train_multi, y_test_multi = train_test_split(
            X, y_multi, test_size=test_size, random_state=42, stratify=y_multi
        )
        
        _, _, y_train_binary, y_test_binary = train_test_split(
            X, y_binary, test_size=test_size, random_state=42, stratify=y_binary
        )
        
        # Build pipeline
        preprocessor = self.build_pipeline(df)
        
        # Define models to train
        models = {
            'random_forest_multi': {
                'model': RandomForestClassifier(n_estimators=100, random_state=42),
                'y_train': y_train_multi,
                'y_test': y_test_multi
            },
            'random_forest_binary': {
                'model': RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced"),
                'y_train': y_train_binary,
                'y_test': y_test_binary
            },
            'gradient_boosting': {
                'model': GradientBoostingClassifier(n_estimators=100, random_state=42),
                'y_train': y_train_binary,
                'y_test': y_test_binary
            },
            'decision_tree': {
                'model': DecisionTreeClassifier(max_depth=5, random_state=42),
                'y_train': y_train_binary,
                'y_test': y_test_binary
            }
        }
        
        # Train each model
        trained_models = {}
        for name, config in models.items():
            print(f"\n🔧 Training {name}...")
            
            # Create pipeline
            pipeline = Pipeline([
                ('preprocessor', preprocessor),
                ('classifier', config['model'])
            ])
            
            # Train
            pipeline.fit(X_train, config['y_train'])
            
            # Predict
            y_pred = pipeline.predict(X_test)
            
            # Evaluate
            accuracy = accuracy_score(config['y_test'], y_pred)
            
            if 'binary' in name or name == 'gradient_boosting':
                roc_auc = roc_auc_score(config['y_test'], pipeline.predict_proba(X_test)[:, 1])
                print(f"   Accuracy: {accuracy:.3f}, ROC-AUC: {roc_auc:.3f}")
            else:
                print(f"   Accuracy: {accuracy:.3f}")
            
            # Store model
            trained_models[name] = {
                'pipeline': pipeline,
                'accuracy': accuracy,
                'features': list(X.columns)
            }
        
        self.models = trained_models
        self.X_test = X_test
        self.y_test_binary = y_test_binary
        self.y_test_multi = y_test_multi
        print("Training samples:", X_train.shape)
        print("Test samples:", X_test.shape)
        return trained_models
    
    def save_models(self, path="models"):
        """Save trained models"""
        import os
        os.makedirs(path, exist_ok=True)
        
        for name, model_info in self.models.items():
            # Save pipeline
            joblib.dump(model_info['pipeline'], f"{path}/{name}.pkl")
            
            # Save metadata
            metadata = {
                'accuracy': model_info['accuracy'],
                'features': model_info['features'],
                'model_type': name
            }
            
            with open(f"{path}/{name}_metadata.json", 'w') as f:
                json.dump(metadata, f, indent=2)
        
        print(f"💾 Models saved to {path}/")
    
    def predict_success(self, game_features, model_name='random_forest_binary'):
        """Predict success for a single game"""
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        
        pipeline = self.models[model_name]['pipeline']
        
        # Convert to DataFrame
        input_df = pd.DataFrame([game_features])
        
        # Predict
        prediction = pipeline.predict(input_df)[0]
        probability = pipeline.predict_proba(input_df)[0]
        
        return {
            'prediction': int(prediction),
            'probability': float(probability[1] if len(probability) == 2 else probability[prediction]),
            'confidence': 'high' if max(probability) > 0.7 else 'medium' if max(probability) > 0.6 else 'low'
        }

# Main execution
if __name__ == "__main__":
    # Initialize predictor
    predictor = GameSuccessPredictor()
    
    # Load and prepare data
    df = predictor.load_and_prepare_data("data/steam_games.csv")
    
    # Train models
    trained_models = predictor.train_models(df)
    
    # Save models
    predictor.save_models()
    
    # Example prediction
    example_game = {
        'genre': 'Adventure',
        'platform': 'PC',
        'price': 19.99,
        'price_category': 'Mid',
        'genre_popularity': 1900,
        'complexity': 1.0
    }
    
    result = predictor.predict_success(example_game)
    print(f"\n🎯 Example prediction: {result}")