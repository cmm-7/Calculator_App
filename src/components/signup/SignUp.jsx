import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      console.log("🔄 handleSignUp triggered...");

      // ✅ Only call Redux action, let Redux handle Firebase signup
      console.log("🚀 Dispatching Redux signUp action...");
      const reduxResponse = await dispatch(signUp({ email, password }));

      if (reduxResponse.error) {
        throw new Error(reduxResponse.payload); // Show Firebase error
      }

      console.log("✅ Redux Response:", reduxResponse);

      // ✅ Redirect User
      setTimeout(() => navigate("/"), 100);
    } catch (error) {
      console.error("❌ Sign up failed:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
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
          autoComplete="new-password"
        />
        <button
          className="w-full p-2 bg-red-500 text-white rounded"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
