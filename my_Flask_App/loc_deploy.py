import requests
import json

url = 'http://127.0.0.1:5000/predict'

sample_data = {
    "customerID": "8779-PEZVU",
    "gender": "Female",
    "SeniorCitizen": 0,
    "Partner": "Yes",
    "Dependents": "No",
    "tenure": 1,
    "PhoneService": "No",
    "MultipleLines": "No internet service",
    "InternetService": "DSL",
    "OnlineSecurity": "No",
    "OnlineBackup": "Yes",
    "DeviceProtection": "No",
    "TechSupport": "No",
    "StreamingTV": "No",
    "StreamingMovies": "No",
    "Contract": "Month-to-month",
    "PaperlessBilling": "Yes",
    "PaymentMethod": "Electronic check",
    "MonthlyCharges": 29.85,
    "TotalCharges": 29.85
}


headers = {'Content-Type': 'application/json'}
try:
    response = requests.post(url, data=json.dumps(sample_data), headers=headers)

    print("Status Code:", response.status_code)
    print("Response Body:", response.json())

except requests.exceptions.ConnectionError as e:
    print(f"Error connecting to the API: {e}")
    print("Please ensure your Flask app is running and accessible at {url}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")