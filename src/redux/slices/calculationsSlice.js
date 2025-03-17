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
  },
});

export const { addCalculation, setHistory } = calculationsSlice.actions;
export default calculationsSlice.reducer;
