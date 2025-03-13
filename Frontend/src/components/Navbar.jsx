import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${scrolled ? 'bg-opacity-95 py-2' : 'py-4'} bg-[#001F3F] text-white transition-all duration-300 shadow-lg`}>
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo & Clickable Title with animation */}
        <div
          className="flex items-center space-x-3 flex-shrink-0 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative overflow-hidden rounded-full p-1 bg-gradient-to-r from-[#3A6D8C] to-[#6A9AB0] transform group-hover:scale-105 transition-all duration-300">
            <img src="/assets/logo.png" alt="Logo" className="h-12 w-12 rounded-full" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-[#EAD8B1] to-[#FAEBD7] bg-clip-text text-transparent group-hover:from-[#FAEBD7] group-hover:to-[#EAD8B1] transition-all duration-300">
            Asset<span className="font-light">Ease</span>
          </span>
        </div>

        {/* Buttons with improved hover effects */}
        {!isAuthenticated && (
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="px-5 py-2 rounded-md bg-[#3A6D8C] text-white hover:bg-[#6A9AB0] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 rounded-md bg-gradient-to-r from-[#6A9AB0] to-[#EAD8B1] text-[#001F3F] font-semibold hover:from-[#EAD8B1] hover:to-[#6A9AB0] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
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