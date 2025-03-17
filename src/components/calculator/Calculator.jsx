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

  // 🔹 Fetch history if the user is logged in
  useEffect(() => {
    if (token) {
      console.log("🟡 Fetching history - Token detected:", token);
      fetchHistory(token)
        .then((history) => {
          console.log("✅ History received:", history);
          dispatch(setHistory(history));
        })
        .catch((error) => console.error("❌ Error fetching history:", error));
    } else {
      console.log("🚫 No token found, skipping history fetch");
    }
  }, [dispatch, token]); // ✅ Include token in dependencies

  const handleButtonClick = async (value) => {
    if (value === "C") {
      console.log("🛑 Clearing display"); // Debugging log
      setInput(""); // ✅ Reset input when "C" is clicked
      return;
    }

    if (value === "=") {
      try {
        const result = eval(input);
        setInput(result.toString());

        if (token) {
          console.log("📤 Sending calculation to backend...");
          dispatch(addCalculation({ expression: input, result }));
          await saveCalculation(token, input, result);
          console.log("✅ Calculation saved successfully!");
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
