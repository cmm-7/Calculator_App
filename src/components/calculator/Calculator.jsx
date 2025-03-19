import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalculatorDisplay from "./CalculatorDisplay";
import {
  addCalculation,
  setHistory,
} from "../../redux/slices/calculationsSlice";
import { fetchHistory, saveCalculation } from "../../utils/api";
import ButtonPanel from "./ButtonsPanel";
import HistoryDisplay from "./HistoryDisplay"; // ✅ Import new history component

const Calculator = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  // ✅ Move useSelector outside useEffect
  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const history = useSelector((state) => state.calculations.history); // ✅ Get history from Redux

  useEffect(() => {
    if (!token || history.length > 0) return;

    console.log("🟡 Fetching history - Token detected:", token);
    fetchHistory(token)
      .then((history) => {
        console.log("✅ History received:", history);
        dispatch(setHistory(history));
      })
      .catch((error) => console.error("❌ Error fetching history:", error));
  }, [dispatch, token, history.length]);

  const handleButtonClick = async (value) => {
    if (value === "C") {
      console.log("🛑 Clearing display");
      setInput("");
      return;
    }

    if (value === "=") {
      try {
        const result = eval(input);
        setInput(result.toString());

        if (token) {
          console.log("📤 Sending calculation to backend...");

          // ✅ Save to backend FIRST before updating Redux
          const savedCalculation = await saveCalculation(token, input, result);

          if (savedCalculation) {
            dispatch(addCalculation({ expression: input, result }));
            console.log("✅ Calculation saved successfully!");
          } else {
            console.error("❌ Failed to save calculation in backend");
          }
        }
      } catch (error) {
        console.error("❌ Invalid calculation");
      }
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 flex flex-col md:flex-row gap-6">
      {/* Calculator (Visible to all users) */}
      <div className={`w-full ${token ? "md:w-2/3" : "w-full"}`}>
        <CalculatorDisplay input={input} setInput={setInput} />
        <ButtonPanel onClick={handleButtonClick} />
      </div>

      {/* History (Only Show for Logged-in Users) */}
      {token && (
        <div className="w-full md:w-1/3">
          <HistoryDisplay history={history} />
        </div>
      )}
    </div>
  );
};

export default Calculator;
