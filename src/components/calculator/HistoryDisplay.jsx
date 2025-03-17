import React from "react";
import { useSelector } from "react-redux";

const HistoryDisplay = () => {
  const history = useSelector((state) => state.calculations.history);

  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">History</h2>
        <p className="text-gray-500">No calculations yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-md h-[27rem] overflow-hidden">
      <h2 className="text-lg font-semibold mb-2">History</h2>
      <div className="overflow-y-auto max-h-[22rem]">
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li key={index} className="p-2 border-b last:border-none">
              <span className="font-medium">{item.expression}</span> ={" "}
              <span className="text-green-600">{item.result}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryDisplay;
