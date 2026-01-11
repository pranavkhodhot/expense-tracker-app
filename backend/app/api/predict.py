from fastapi import APIRouter, HTTPException
import joblib
import numpy as np

router = APIRouter()

# === Load the saved model at startup ===
MODEL_PATH = "app/ml/model_files/transaction_classifier.pkl"

try:
    model = joblib.load(MODEL_PATH)
    print("✅ ML model loaded successfully.")
except Exception as e:
    print("❌ Failed to load model:", str(e))
    model = None


@router.post("/predict_category")
def predict_category(transaction_name: str):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Predict
        pred = model.predict([transaction_name])[0]
        prob = np.max(model.predict_proba([transaction_name]))  # Highest confidence score

        return {
            "transaction_name": transaction_name,
            "predicted_category": pred,
            "confidence": round(float(prob), 3)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")
