import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useEffect, useState } from "react";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [renderKey, setRenderKey] = useState(0); // Forces re-render

  useEffect(() => {
    console.log("👀 Navbar - Redux User:", user);
    setRenderKey((prev) => prev + 1); // ✅ Forces Navbar to update
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav
      key={renderKey}
      className="bg-gray-800 text-white p-4 flex justify-between items-center"
    >
      <h1 className="text-xl font-bold">Calculator App</h1>
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-gray-300">
          Calculator
        </Link>
        {user ? (
          <>
            <Link to="/2fa-settings" className="hover:text-gray-300">
              2FA Settings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/signup" className="hover:text-gray-300">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
