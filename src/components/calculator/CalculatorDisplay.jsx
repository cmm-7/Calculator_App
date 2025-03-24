import React from "react";
import { useSelector } from "react-redux";

const CalculatorDisplay = ({ input, setInput }) => {
  const history = useSelector((state) => state.calculations.history);

  const handleChange = (e) => {
    // Only allow numbers and operators
    const value = e.target.value.replace(/[^0-9+\-*/.()]/g, "");
    setInput(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
  };

  return (
    <div className="bg-gray-900 text-white text-right p-4 rounded-lg">
      <form onSubmit={handleSubmit} autoComplete="off" data-1p-ignore>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9+\-*/.()]*"
          value={input}
          onChange={handleChange}
          className="bg-transparent text-3xl min-h-[50px] w-full text-right outline-none"
          autoFocus
          autoComplete="off"
          data-1p-ignore="true"
          data-form-type="other"
          data-lpignore="true"
          name="calculator-input"
          aria-label="Calculator input"
          role="textbox"
          aria-autocomplete="none"
        />
      </form>

      {history.length > 0 && (
        <div className="text-sm text-gray-400">
          {history[0].expression} = {history[0].result}
        </div>
      )}
    </div>
  );
};

export default CalculatorDisplay;
