import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { firebaseApp } from "../../utils/firebaseConfig";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const auth = getAuth(firebaseApp);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return; // Prevent duplicate login attempts
    setIsLoggingIn(true);

    if (!email.trim() || !password.trim()) {
      alert("Email and password are required.");
      setIsLoggingIn(false);
      return;
    }

    try {
      const auth = getAuth();
      console.log("🔄 Attempting Firebase login...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      console.log("✅ Firebase Login Success - Token:", token);

      console.log("🚀 Dispatching login to Redux...");
      const result = await dispatch(login({ token })).unwrap();

      console.log("✅ Redux Login Success!", result);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userCredential.user));

      navigate("/");
    } catch (error) {
      console.error("❌ Firebase Login Failed:", error);
      alert("Login failed: " + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
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
          className="w-full p-2 bg-green-500 text-white rounded"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
