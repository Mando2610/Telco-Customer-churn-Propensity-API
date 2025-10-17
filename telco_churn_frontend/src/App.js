import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Online deployment
// const API_URL = "https://telco-customer-churn-propensity-ml-model.onrender.com/predict";

// Local Testing
const API_URL = "http://127.0.0.1:5000/predict";

const selectOptions = {
  gender: ["Female", "Male"],
  Partner: ["No", "Yes"],
  Dependents: ["No", "Yes"],
  PhoneService: ["No", "Yes"],
  MultipleLines: ["No", "No phone service", "Yes"],
  InternetService: ["DSL", "Fiber optic", "No"],
  OnlineSecurity: ["No", "No internet service", "Yes"],
  OnlineBackup: ["No", "No internet service", "Yes"],
  DeviceProtection: ["No", "No internet service", "Yes"],
  TechSupport: ["No", "No internet service", "Yes"],
  StreamingTV: ["No", "No internet service", "Yes"],
  StreamingMovies: ["No", "No internet service", "Yes"],
  Contract: ["Month-to-month", "One year", "Two year"],
  PaperlessBilling: ["No", "Yes"],
  PaymentMethod: [
    "Bank transfer (automatic)",
    "Credit card (automatic)",
    "Electronic check",
    "Mailed check",
  ],
};

function App() {
  const [formData, setFormData] = useState({
    gender: "",
    SeniorCitizen: "",
    Partner: "",
    Dependents: "",
    tenure: "",
    PhoneService: "",
    MultipleLines: "",
    InternetService: "",
    OnlineSecurity: "",
    OnlineBackup: "",
    DeviceProtection: "",
    TechSupport: "",
    StreamingTV: "",
    StreamingMovies: "",
    Contract: "",
    PaperlessBilling: "",
    PaymentMethod: "",
    MonthlyCharges: "",
    TotalCharges: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    const required = [
      "gender",
      "SeniorCitizen",
      "Partner",
      "Dependents",
      "tenure",
      "PhoneService",
      "InternetService",
      "Contract",
      "MonthlyCharges",
      "TotalCharges",
      "PaperlessBilling",
      "PaymentMethod",
    ];
    for (let f of required) {
      if (formData[f] === "" || formData[f] === null) {
        toast.error(`Please fill ${f}`);
        return false;
      }
    }
    if (isNaN(Number(formData.tenure)) || Number(formData.tenure) < 0) {
      toast.error("Tenure must be a non-negative integer");
      return false;
    }
    if (isNaN(Number(formData.MonthlyCharges))) {
      toast.error("MonthlyCharges must be a number");
      return false;
    }
    if (formData.TotalCharges !== "" && isNaN(Number(formData.TotalCharges))) {
      toast.error("TotalCharges must be a number (or leave blank)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);

    const payload = {
      ...formData,
      SeniorCitizen: Number(formData.SeniorCitizen),
      tenure: Number(formData.tenure),
      MonthlyCharges: Number(formData.MonthlyCharges),
      TotalCharges:
        formData.TotalCharges === "" ? 0.0 : Number(formData.TotalCharges),
    };

    try {
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(res.data);
      toast.success("✅ Prediction received!");
    } catch (err) {
      console.error("API Error:", err);
      toast.error("⚠️ API connection failed. Check console or CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Telco Customer Churn Predictor</h1>
      <form className="churn-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {Object.entries({
            gender: "Gender",
            SeniorCitizen: "Senior Citizen (0 = No, 1 = Yes)",
            Partner: "Partner",
            Dependents: "Dependents",
            PhoneService: "Phone Service",
            MultipleLines: "Multiple Lines",
            InternetService: "Internet Service",
            OnlineSecurity: "Online Security",
            OnlineBackup: "Online Backup",
            DeviceProtection: "Device Protection",
            TechSupport: "Tech Support",
            StreamingTV: "Streaming TV",
            StreamingMovies: "Streaming Movies",
            Contract: "Contract",
            PaperlessBilling: "Paperless Billing",
            PaymentMethod: "Payment Method",
          }).map(([key, label]) => {
            if (key === "SeniorCitizen") {
              return (
                <div className="form-field" key={key}>
                  <label>{label}</label>
                  <select name={key} value={formData[key]} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="0">0 - No</option>
                    <option value="1">1 - Yes</option>
                  </select>
                </div>
              );
            }
            return (
              <div className="form-field" key={key}>
                <label>{label}</label>
                <select name={key} value={formData[key]} onChange={handleChange}>
                  <option value="">Select</option>
                  {(selectOptions[key] || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          <div className="form-field">
            <label>Tenure (months)</label>
            <input
              name="tenure"
              type="number"
              min="0"
              step="1"
              value={formData.tenure}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Monthly Charges ($)</label>
            <input
              name="MonthlyCharges"
              type="number"
              step="0.01"
              min="0"
              value={formData.MonthlyCharges}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Total Charges ($)</label>
            <input
              name="TotalCharges"
              type="number"
              step="0.01"
              min="0"
              value={formData.TotalCharges}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Churn"}
        </button>
      </form>

      {result && (
        <div className="result">
          {result.error ? (
            <div className="error">Error: {result.error}</div>
          ) : (
            <>
              <h2>Prediction Result</h2>
              <p>
                <strong>Churn:</strong>{" "}
                {result.prediction === 1 ? "⚠️ Yes (Customer likely to churn)" : "✅ No (Customer likely to stay)"}
              </p>
              <p>
                <strong>Probability:</strong>{" "}
                {(result.probability * 100).toFixed(2)}%
              </p>
            </>
          )}
        </div>
      )}

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

export default App;
