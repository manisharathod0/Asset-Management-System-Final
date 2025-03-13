
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (email && password) {
      console.log("User Registered:", { email, password });
      navigate("/login"); // Redirect to login page after signup
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#EAD8B1]">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-[#001F3F] mb-4 text-center">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="w-full py-2 bg-[#001F3F] text-white rounded-md hover:bg-[#3A6D8C] transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;


