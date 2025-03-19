import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Change if needed

// ✅ Sign Up Action using your backend
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log("🚀 Fetching Firebase token...");
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      console.log("🔑 Firebase Token:", token);

      // ✅ Sign Up with Backend (Ensures user is stored)
      const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        throw new Error(errorData.error || "Signup failed");
      }

      console.log("✅ Backend Signup Success!");

      // 🔄 **Now log in after successful signup**
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await loginResponse.json();
      console.log("✅ Redux signUp Success:", data);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return { user: data.user, token };
    } catch (error) {
      console.error("❌ Redux signUp Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ token }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.user) {
      console.log("🔹 Skipping redundant login - User already exists.");
      return auth;
    }

    try {
      console.log("🟢 Redux login - Using token:", token);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("🟢 Redux login success - User:", data.user);
      return { user: data.user, token };
    } catch (error) {
      console.error("❌ Redux login failed:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("🚪 Logging out user...");
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, () => {
        console.log("⏳ Redux signUp Pending...");
      })
      .addCase(signUp.fulfilled, (state, action) => {
        console.log("✅ Redux Updated - User after signup:", action.payload);

        if (!action.payload?.user) {
          console.warn(
            "⚠️ No user returned from backend. Check response format."
          );
          return;
        }

        state.user = action.payload.user; // ✅ Store user properly
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signUp.rejected, (state, action) => {
        console.error("❌ Redux signUp Failed:", action.payload);
        state.error = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        if (!action.payload) {
          console.error("❌ Redux did not receive a valid payload:", action);
          return;
        }
        state.user = action.payload.user;
        state.token = action.payload.token;
        console.log("🟢 Redux State Updated - User:", state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
