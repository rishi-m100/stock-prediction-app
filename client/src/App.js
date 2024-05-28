import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const stockOptions = [
  "AAPL",
  "MSFT",
  "AMZN",
  "GOOGL",
  "GOOG",
  "META",
  "TSLA",
  "BRK-B",
  "NVDA",
  "JPM",
  "JNJ",
  "UNH",
  "V",
  "PG",
  "HD",
  "DIS",
  "MA",
  "PYPL",
  "BAC",
  "VZ",
  "ADBE",
  "CMCSA",
  "NFLX",
  "KO",
  "INTC",
  "PFE",
  "MRK",
  "PEP",
  "T",
  "XOM",
  "CSCO",
  "ABBV",
  "COST",
  "CRM",
  "AVGO",
  "ACN",
  "QCOM",
  "NKE",
  "WMT",
  "TXN",
  "MDT",
  "HON",
  "LLY",
  "UNP",
  "AMGN",
  "NEE",
  "LIN",
  "IBM",
  "LMT",
  "ORCL",
].map((stock) => ({ value: stock, label: stock }));

function App() {
  const [data, setData] = useState("");
  const [val, setVal] = useState([]);
  const [plotImage, setPlotImage] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [daysAhead, setDaysAhead] = useState();

  // useEffect(() => {
  //   fetch("http://127.0.0.1:5000")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setData(data.message);
  //     });
  // }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedStock) {
      alert("Please select a stock symbol.");
      return;
    }

    try {
      // console.log("hi", selectedStock.value);
      // const response = axios.post("http://127.0.0.1:5000/input", {
      //   stock: selectedStock.value,
      // });

      axios
        .post("http://127.0.0.1:5000/input", {
          stock: selectedStock.value,
          days: daysAhead,
        })
        .then((res) => {
          // console.log(res.data.message);
          setVal(res.data.predictions);
          setPlotImage(res.data.plot);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <center>
        <h1 className="mt-[5rem] mb-4 text-3xl font-extrabold text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text text-white">
            Stock Price Prediction
          </span>
        </h1>
      </center>
      <center>
        <p className="text-lg font-normal text-white lg:text-xl">
          Select a stock symbol to predict future prices.
        </p>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </center>
      <form style={{ marginTop: "-50px" }} onSubmit={handleSubmit}>
        <div className="flex items-center justify-center bg-grey-lighter mb-5 mt-[5rem]">
          <Select
            options={stockOptions}
            onChange={setSelectedStock}
            placeholder="Select a stock symbol"
            className="w-64 text-black mr-2 custom-select"
            styles={{
              input: (provided) => ({
                ...provided,
                color: "white",
              }),
              control: (provided, state) => ({
                ...provided,
                outline: "none !important",
                backgroundColor: state.isFocused
                  ? "transparent"
                  : "transparent",
                "&:hover": {
                  backgroundColor: state.isFocused
                    ? "transparent"
                    : "transparent",
                },
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white",
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "white",
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#1f2948",
              }),
              option: (provided, state) => ({
                ...provided,
                color: "white",
                backgroundColor: state.isFocused ? "black" : "transparent",
                "&:hover": {
                  backgroundColor: "black",
                },
              }),
            }}
          />
          <input
            type="number"
            value={daysAhead}
            onChange={(e) => setDaysAhead(e.target.value)}
            min="1"
            placeholder="Days ahead"
            className="w-24 text-black p-2 border rounded"
          />
        </div>
        <div className="flex items-center justify-center mt-5">
          <button
            className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            type="submit"
          >
            PREDICT
          </button>
        </div>
      </form>

      <div style={{ marginTop: "20px" }} className="mt-[5rem] mb-4 text-2xl">
        <center>
          <span className="text-transparent text-white font-black">
            Predicted prices:
          </span>
        </center>
        <br></br>
        <center>
          <table className="table-auto border-collapse border border-blue-500 mt-4">
            <thead>
              <tr>
                <th className="border border-blue-500 px-4 py-2">Day</th>
                <th className="border border-blue-500 px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {val.map((price, index) => (
                <tr key={index}>
                  <td className="border border-blue-500 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-blue-500 px-4 py-2">
                    {price[0].toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </center>
      </div>
      <br></br>
      {plotImage && (
        <div className="mt-8">
          <center>
            <img
              src={`data:image/png;base64,${plotImage}`}
              alt="Predictions Plot"
              style={{ width: "60%", maxWidth: "800px" }}
            />
          </center>
        </div>
      )}
      <br></br>
    </>
  );
}

export default App;
