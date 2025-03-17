import React from "react";

const ButtonPanel = ({ onClick }) => {
  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
    "C", // ✅ Added Clear Button
  ];

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {buttons.map((btn) => (
        <button
          key={btn}
          className={
            btn === "C"
              ? "p-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              : "p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          }
          onClick={() => onClick(btn)}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default ButtonPanel;
