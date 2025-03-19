
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust the import path as needed

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user} = useAuth(); // Access the authentication state, user data function
  const [scrolled, setScrolled] = React.useState(false);

  // Add scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle title click
  const handleTitleClick = () => {
    if (isAuthenticated) {
      // Navigate to the dashboard based on the user's role
      switch (user?.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "employee":
          navigate("/employee/dashboard");
          break;
        default:
          navigate("/"); // Fallback for unknown roles
      }
    } else {
      // Navigate to the Welcome Page if not authenticated
      navigate("/");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 ${
        scrolled ? "bg-opacity-95 py-2" : "py-4"
      } bg-[#001F3F] text-white transition-all duration-300 shadow-lg`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo & Clickable Title with animation */}
        <div
          className="flex items-center space-x-3 flex-shrink-0 cursor-pointer group"
          onClick={handleTitleClick} // Call handleTitleClick on click
        >
          <div className="relative overflow-hidden rounded-full p-1 bg-gradient-to-r from-[#3A6D8C] to-[#6A9AB0] transform group-hover:scale-105 transition-all duration-300">
            <img src="/assets/logo.png" alt="Logo" className="h-12 w-12 rounded-full" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-[#EAD8B1] to-[#FAEBD7] bg-clip-text text-transparent group-hover:from-[#FAEBD7] group-hover:to-[#EAD8B1] transition-all duration-300">
            Asset<span className="font-light">Ease</span>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;