import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/slices/authSlice";
import Navbar from "./components/navbar/Navbar";
import SignUp from "./components/signup/SignUp";
import Login from "./components/login/Login";
import Calculator from "./components/calculator/Calculator";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log("🚀 App Loaded - Redux User:", user);
  }, [user]); // ✅ Run when Redux user changes

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      console.log("🟢 Restoring user session:", storedUser);

      // ✅ Directly dispatching the fulfilled action to update Redux immediately
      dispatch({
        type: "auth/login/fulfilled",
        payload: { user: storedUser, token: storedToken },
      });
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar /> {/* ✅ Always updates based on Redux state */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Calculator />} />
      </Routes>
    </Router>
  );
}

export default App;
