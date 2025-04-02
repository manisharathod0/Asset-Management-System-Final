import { useState } from "react";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { motion } from "framer-motion";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Color theme
  const colors = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    sand: "#EAD8B1"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setRole("Employee");
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const inputAnimation = {
    rest: { scale: 1 },
    focus: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <motion.div
      className="p-8 m-8 md:m-16 lg:m-32 rounded-3xl shadow-2xl mx-auto relative"
      style={{
        background: `linear-gradient(145deg, ${colors.mediumBlue}, ${colors.darkBlue})`,
        maxWidth: "600px"
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-white p-8 rounded-3xl shadow-lg"
        variants={itemVariants}
      >
        <motion.div className="flex items-center justify-center mb-6" variants={itemVariants}>
          <FaUserPlus size={32} style={{ color: colors.darkBlue }} className="mr-3" />
          <h2 className="text-3xl font-bold text-center" style={{ color: colors.darkBlue }}>
            Add New User
          </h2>
        </motion.div>

        {success && (
          <motion.div
            className="mb-6 p-4 rounded-2xl text-center"
            style={{ backgroundColor: "#d1fae5" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-green-700 font-medium">User Added Successfully!</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className="relative"
            variants={itemVariants}
            initial="rest"
            whileFocus="focus"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <FaUser style={{ color: colors.mediumBlue }} />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: colors.lightBlue, 
                backgroundColor: "#f8fafc",
                focusRing: colors.mediumBlue
              }}
            />
          </motion.div>

          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <FaEnvelope style={{ color: colors.mediumBlue }} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: colors.lightBlue,
                backgroundColor: "#f8fafc",
                focusRing: colors.mediumBlue
              }}
            />
          </motion.div>

          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <FaLock style={{ color: colors.mediumBlue }} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: colors.lightBlue,
                backgroundColor: "#f8fafc",
                focusRing: colors.mediumBlue
              }}
            />
          </motion.div>

          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <FaUserTag style={{ color: colors.mediumBlue }} />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent appearance-none"
              style={{ 
                borderColor: colors.lightBlue,
                backgroundColor: "#f8fafc",
                focusRing: colors.mediumBlue
              }}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full p-4 rounded-xl text-white font-medium flex items-center justify-center"
            style={{ backgroundColor: colors.mediumBlue }}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <FaUserPlus className="mr-2" /> Add User
              </div>
            )}
          </motion.button>
        </form>

        <motion.div 
          className="mt-6 pt-4 border-t text-center text-sm"
          style={{ borderColor: colors.sand, color: colors.darkBlue }}
          variants={itemVariants}
        >
          <p>All fields are required to create a new user account</p>
        </motion.div>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default AddUser;