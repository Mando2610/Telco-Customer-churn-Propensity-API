import pandas as pd
import numpy as np
import joblib

def preprocess_data(data, scaler, model_columns):
    df = pd.DataFrame([data])

    num_cols = ['tenure', 'MonthlyCharges', 'TotalCharges']
    for col in num_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    df_processed = pd.get_dummies(df)

    for col in num_cols:
        if col not in df_processed.columns:
            df_processed[col] = 0

    df_processed = df_processed.reindex(columns=model_columns, fill_value=0)

    df_processed[num_cols] = scaler.transform(df_processed[num_cols])

    return df_processed