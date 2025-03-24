import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router";
import TwoFactorVerification from "../auth/TwoFactorVerification";
import { auth } from "../../utils/firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, requires2FA } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      alert("Email and password are required.");
      return;
    }

    try {
      // Ensure Firebase is initialized
      if (!auth) {
        throw new Error("Authentication not initialized");
      }

      const result = await dispatch(login({ email, password })).unwrap();

      // If 2FA is not required, redirect to home
      if (!result.requires2FA) {
        navigate("/");
      }
      // If 2FA is required, the TwoFactorVerification component will be shown
    } catch (error) {
      console.error("❌ Login Failed:", error);
      alert("Login failed: " + error);
    }
  };

  // Show 2FA verification screen if required
  if (requires2FA) {
    return <TwoFactorVerification />;
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
