import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
};

const calculationsSlice = createSlice({
  name: "calculations",
  initialState,
  reducers: {
    addCalculation: (state, action) => {
      state.history.unshift(action.payload);
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    updateCalculation: (state, action) => {
      const { id, expression, result } = action.payload;
      const index = state.history.findIndex((calc) => calc.id === id);
      if (index !== -1) {
        state.history[index] = { ...state.history[index], expression, result };
      }
    },
    deleteCalculation: (state, action) => {
      const id = action.payload;
      state.history = state.history.filter((calc) => calc.id !== id);
    },
  },
});

export const {
  addCalculation,
  setHistory,
  updateCalculation,
  deleteCalculation,
} = calculationsSlice.actions;

export default calculationsSlice.reducer;
