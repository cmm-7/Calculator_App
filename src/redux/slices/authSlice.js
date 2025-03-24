import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  PhoneAuthProvider,
  multiFactor,
} from "firebase/auth";

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

// Update user profile (including 2FA settings)
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      // If 2FA status is changing, use the appropriate endpoint
      if (userData.two_factor_enabled !== auth.user?.two_factor_enabled) {
        const endpoint = userData.two_factor_enabled
          ? "enable-2fa"
          : "disable-2fa";
        const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Failed to ${
                userData.two_factor_enabled ? "enable" : "disable"
              } 2FA`
          );
        }
      }

      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify 2FA code during login
export const verify2FA = createAsyncThunk(
  "auth/verify2FA",
  async ({ verificationCode, tempToken }, { rejectWithValue }) => {
    try {
      console.log("🔄 Verifying 2FA code...");

      // Verify the code with the backend
      const response = await fetch(`${API_BASE_URL}/auth/verify-2fa-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify 2FA code");
      }

      const data = await response.json();
      console.log("✅ 2FA verification successful:", data);

      if (!data.user) {
        throw new Error("No user data received from server");
      }

      // Store the token and user data
      localStorage.setItem("token", tempToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      return { user: data.user, token: tempToken };
    } catch (error) {
      console.error("❌ 2FA verification failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Modify login thunk to handle 2FA
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.user) {
      console.log("🔹 Skipping redundant login - User already exists.");
      return auth;
    }

    try {
      console.log("🔄 Attempting Firebase login...");
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

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

      // If 2FA is required, the backend will send a verification code
      if (data.requires2FA) {
        console.log("🔒 2FA required, verification code sent to email");
        return {
          requires2FA: true,
          tempToken: token,
          email: email,
        };
      }

      // If no 2FA required, complete the login
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return { user: data.user, token };
    } catch (error) {
      console.error("❌ Login error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  requires2FA: false,
  tempToken: null,
  error: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("🚪 Logging out user...");
      state.user = null;
      state.token = null;
      state.requires2FA = false;
      state.tempToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearAuthError: (state) => {
      state.error = null;
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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requires2FA) {
          state.requires2FA = true;
          state.tempToken = action.payload.tempToken;
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.requires2FA = false;
          state.tempToken = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verify2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.requires2FA = false;
        state.tempToken = null;
        state.error = null;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
