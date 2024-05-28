from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pandas as pd
import joblib
import numpy as np
import yfinance as yf
from tensorflow.keras.models import load_model
from datetime import datetime, timedelta
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

app = Flask(__name__, static_folder='./build', static_url_path='/')
# CORS(app, resources={r"/*": {"origins": "*"}})

CORS(app)


@app.route("/")
def serve():
    return send_from_directory(app.static_folder, 'index.html')

model = load_model('models/stock_predictor.h5')
scaler = joblib.load('models/scaler.pkl')

@app.route("/input", methods=['POST'])
def input():
    data = request.json
    stock_symbol = data.get('stock')
    days = data.get('days', 10) 
    days = int(days)
    if not stock_symbol:
        return jsonify({"message": "No stock symbol provided"}), 400

    

    start_date = '2012-01-01'
    end_date = datetime.now().strftime('%Y-%m-%d')
    new_data = yf.download(stock_symbol, start=start_date, end=end_date)

    if new_data.empty:
        return jsonify({"message": "Stock data not available"}), 404

    def predict_future_prices(model, scaler, data, look_back=60, days_ahead=20):
        last_60_days = data[-look_back:].values
        last_60_days_scaled = scaler.transform(last_60_days)

        future_predictions = []
        for _ in range(days_ahead):
            x_input = last_60_days_scaled[-look_back:]
            x_input = np.reshape(x_input, (1, x_input.shape[0], 1))
            pred_price = model.predict(x_input, verbose=0)
            future_predictions.append(pred_price[0, 0])

            last_60_days_scaled = np.append(last_60_days_scaled, [[pred_price[0, 0]]], axis=0)

        future_predictions = np.array(future_predictions)
        future_predictions = future_predictions.reshape(-1, 1)
        future_predictions = scaler.inverse_transform(future_predictions)

        return future_predictions


    data = new_data.filter(['Close'])


    future_predictions = predict_future_prices(model, scaler, data, days_ahead=days)


    last_date = data.index[-1]
    future_dates = [last_date + timedelta(days=i) for i in range(1, days+1)]
    future_data = pd.DataFrame(future_predictions, index=future_dates, columns=['Predicted Close'])


    plt.figure(figsize=(16, 8))
    plt.title('Predicted Stock Prices')
    plt.xlabel('Date')
    plt.ylabel('Close Price (USD)')
    

    plt.plot(data.index[-365:], data['Close'][-365:], label='Actual Prices', color='blue')
    

    plt.plot(future_data.index, future_data['Predicted Close'], label='Predicted Prices', color='red', linestyle='--')
    
    plt.legend()


    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')

    plt.close()

    buffer.seek(0)


    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

    return jsonify({"predictions": future_predictions.tolist(), "plot": image_base64})


@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)


if __name__ == '__main__':
    app.run(debug=True)
