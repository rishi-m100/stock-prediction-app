# Stock Prediction App

This project implements a stock price prediction model using machine learning, specifically the LSTM architecture. It predicts future stock prices based on historical data of selected stocks. The frontend is built using React, allowing users to select a stock symbol and the number of days ahead to predict. The backend is implemented in Flask, serving the machine learning model, and providing predictions and visualizations.

## Deployment Link

The project is deployed and accessible at: [Stock Prediction App](https://stock-prediction-app-y9vw.onrender.com/)

(Please be patient - the free hosting site takes up to 2 minutes to load)

## Features

- Predict future stock prices based on historical data.
- Select from a wide range of stock symbols.
- Customize the number of days ahead for predictions.

## Technologies Used

- **Frontend**:
  - React
  - Axios
  - react-select

- **Backend**:
  - Flask
  - yfinance
  - scikit-learn
  - TensorFlow
  - matplotlib

## Usage

1. Visit the deployment link: [Stock Prediction App](https://stock-prediction-app-y9vw.onrender.com/)
2. Select a stock symbol from the dropdown menu.
3. Enter the number of days ahead for prediction.
4. Click on the "PREDICT" button to see the predicted prices.
5. View the predicted prices in the table and the visualization plot.

## Local Development

To run the project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/rishi-m100/stock-prediction-app.git
# Clone
```

2. Install dependencies:
   
  ```bash
  npm install  # For frontend dependencies
  pip install -r requirements.txt  # For backend dependencies
  ```
3. Start the frontend and backend servers:

  ```bash
    npm start  # Start the React server
    python server.py  # Start the Flask server
  ```
