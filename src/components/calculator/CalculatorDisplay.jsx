import React from "react";
import { useSelector } from "react-redux";

const CalculatorDisplay = ({ input, setInput }) => {
  const history = useSelector((state) => state.calculations.history);

  return (
    <div className="bg-gray-900 text-white text-right p-4 rounded-lg">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="bg-transparent text-3xl min-h-[50px] w-full text-right outline-none"
        autoFocus
      />

      {history.length > 0 && (
        <div className="text-sm text-gray-400">
          {history[0].expression} = {history[0].result}
        </div>
      )}
    </div>
  );
};

export default CalculatorDisplay;
