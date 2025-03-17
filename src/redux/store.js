import { configureStore } from "@reduxjs/toolkit";
import calculationsReducer from "./slices/calculationsSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    calculations: calculationsReducer,
    auth: authReducer,
  },
});
