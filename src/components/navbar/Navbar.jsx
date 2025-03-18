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
      <div>
        <Link to="/" className="px-4">
          Calculator
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="px-4">
              Login
            </Link>
            <Link to="/signup" className="px-4">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
