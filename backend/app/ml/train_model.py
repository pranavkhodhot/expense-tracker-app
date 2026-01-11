import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

# === Load dataset ===
df = pd.read_csv("app/ml/data/trainingv3.csv")

# Clean and normalize labels
df['category_name'] = df['category_name'].str.strip().str.title()

# === Split ===
X = df['transaction_name']
y = df['category_name']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# === Create pipeline ===
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1,2), max_df=0.85, min_df=2)),
    ('clf', LogisticRegression(max_iter=1000, C=2.0))
])

# === Train ===
pipeline.fit(X_train, y_train)

# === Evaluate ===
y_pred = pipeline.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(classification_report(y_test, y_pred))

# === Save model ===
joblib.dump(pipeline, "app/ml/model_files/transaction_classifier.pkl")
print("✅ Model saved to app/ml/model_files/transaction_classifier.pkl")
