import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }
    alert(`User Added: ${name}, ${email}, ${role}`);
    setName("");
    setEmail("");
    setRole("Employee");
  };

  return (
    <motion.div 
      className="p-6 bg-white m-40 shadow-lg rounded-xl w-90vh mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2"> Add New User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full p-3 border rounded-lg focus:outline-none" 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 border rounded-lg focus:outline-none" 
        />
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="w-full p-3 border rounded-lg focus:outline-none"
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
        >
          Add User
        </button>
      </form>
    </motion.div>
  );
};

export default AddUser;
