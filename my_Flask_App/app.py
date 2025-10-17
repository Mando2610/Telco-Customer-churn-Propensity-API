from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS
from utils import preprocess_data

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load("models/xgboost_model.pkl")
    scaler = joblib.load("models/scaler.pkl")
    model_columns = joblib.load("models/model_columns.pkl")
    print("✅ Model, scaler, and columns loaded successfully.")
except FileNotFoundError as e:
    print(f"❌ Error loading model files: {e}")
    print("Please ensure the files exist in the 'models' folder.")
    exit()

@app.route('/')
def home():
    return "✅ Telco Churn Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        df_processed = preprocess_data(data, scaler, model_columns)

        prediction = model.predict(df_processed)
        prediction_proba = model.predict_proba(df_processed)[:, 1]

        return jsonify({
            'prediction': int(prediction[0]),
            'probability': float(prediction_proba[0])
        })

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
