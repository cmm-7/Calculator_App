import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCalculation,
  deleteCalculation,
} from "../../redux/slices/calculationsSlice";
import {
  updateCalculation as updateCalculationAPI,
  deleteCalculation as deleteCalculationAPI,
} from "../../utils/api";

const EditModal = ({ calculation, onClose, onSave }) => {
  const [expression, setExpression] = useState(calculation.expression);
  const [error, setError] = useState("");

  const calculateResult = (expr) => {
    try {
      // Basic validation to ensure only mathematical expressions
      if (!/^[0-9+\-*/(). ]+$/.test(expr)) {
        throw new Error("Invalid characters in expression");
      }
      const result = eval(expr);
      if (!isFinite(result)) {
        throw new Error("Invalid calculation");
      }
      return result;
    } catch (error) {
      throw new Error("Invalid expression");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!calculation.id) {
      setError("Invalid calculation ID");
      return;
    }

    try {
      const result = calculateResult(expression);
      onSave(calculation.id, expression, result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getDisplayResult = () => {
    try {
      return calculateResult(expression).toString();
    } catch {
      return "Result will appear here";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Calculation</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expression
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              placeholder="Enter mathematical expression"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Result (auto-calculated)
            </label>
            <div className="mt-1 w-full p-2 bg-gray-50 border rounded text-gray-600">
              {getDisplayResult()}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const HistoryDisplay = () => {
  const history = useSelector((state) => state.calculations.history);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [editingCalculation, setEditingCalculation] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">History</h2>
        <p className="text-gray-500">No calculations yet.</p>
      </div>
    );
  }

  const handleEdit = (calculation) => {
    if (!calculation?.id) {
      console.error("Attempted to edit calculation without ID:", calculation);
      return;
    }
    setEditingCalculation(calculation);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Attempted to delete calculation without ID");
      return;
    }

    try {
      await deleteCalculationAPI(token, id);
      dispatch(deleteCalculation(id));
    } catch (error) {
      console.error("Failed to delete calculation:", error);
      alert("Failed to delete calculation. Please try again.");
    }
  };

  const handleSave = async (id, expression, result) => {
    if (!id) {
      console.error("Attempted to update calculation without ID");
      return;
    }

    try {
      const updated = await updateCalculationAPI(token, id, expression, result);
      if (updated) {
        dispatch(updateCalculation({ id, expression, result }));
        setEditingCalculation(null);
      }
    } catch (error) {
      console.error("Failed to update calculation:", error);
      alert("Failed to update calculation. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md h-[27rem] overflow-hidden">
      <h2 className="text-lg font-semibold mb-2">History</h2>
      <div className="overflow-y-auto max-h-[22rem]">
        <ul className="space-y-2">
          {history.map((item) =>
            item && item.id ? (
              <li
                key={item.id}
                className="p-2 border-b last:border-none flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{item.expression}</span> ={" "}
                  <span className="text-green-600">{item.result}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ) : null
          )}
        </ul>
      </div>

      {editingCalculation && editingCalculation.id && (
        <EditModal
          calculation={editingCalculation}
          onClose={() => setEditingCalculation(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default HistoryDisplay;
