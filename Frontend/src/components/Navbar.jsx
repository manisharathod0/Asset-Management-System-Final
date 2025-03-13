
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#001F3F] text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo & Clickable Title */}
        <div
          className="flex items-center space-x-2 flex-shrink-0 cursor-pointer"
          onClick={() => navigate("/")} // Navigate to Welcome Page on Click
        >
          <img src="/assets/logo.png" alt="Logo" className="h-14 w-14" />
          <span className="text-3xl font-bold text-[#EAD8B1]">Asset Ease</span>
        </div>

        {/* Buttons - Hide after login */}
        {!isAuthenticated && (
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="px-5 py-2 rounded-md bg-[#3A6D8C] text-white hover:bg-[#6A9AB0] transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 rounded-md bg-[#6A9AB0] text-[#001F3F] font-semibold hover:bg-[#EAD8B1] transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
