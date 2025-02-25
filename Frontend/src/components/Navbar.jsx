import React from "react";
import "../styles/global.css"; // Import global styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Title */}
        <img src="/assets/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Asset Management</span>
      </div>
    </nav>
  );
};

export default Navbar;
