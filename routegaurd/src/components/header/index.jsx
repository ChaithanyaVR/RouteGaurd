import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <nav className="flex justify-between items-center w-full px-6 py-3 z-20 fixed top-0 left-0 shadow-md bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
      <div className="text-white text-lg font-bold tracking-wide">Route Optimizer</div>

      <div className="flex gap-4 items-center">
        {userLoggedIn ? (
          <button
            onClick={() =>
              doSignOut().then(() => {
                navigate("/login");
              })
            }
            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-1.5 rounded-full text-sm transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-green-600 hover:bg-green-100 px-4 py-1.5 rounded-full text-sm transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

