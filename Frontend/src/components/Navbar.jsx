import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container flex items-center">
        {/* Logo and Title */}
        <div className="flex items-center w-full">
          <img src="logo.png" alt="Logo" className="h-10 w-10 mr-2" />
          <span className="text-xl font-bold">Asset Management</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
