import { useState, useEffect } from "react";
import { FaUserEdit, FaUserMinus, FaUsers, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Change this as per your backend route

const AllUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Color theme
  const colors = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    sand: "#EAD8B1"
  };

  // Fetch Users from Backend
  useEffect(() => {
    setLoading(true);
    axios.get(API_URL)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // Filter Users for Search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Edit User
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedRole(user.role);
  };

  // Save Edited User (Update in Backend)
  const handleSaveEdit = () => {
    axios.put(`${API_URL}/${editingUser}`, { name: editedName, email: editedEmail, role: editedRole })
      .then(() => {
        setUsers(users.map(user => user._id === editingUser ? { ...user, name: editedName, email: editedEmail, role: editedRole } : user));
        setEditingUser(null);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  // Remove User (Delete from Backend)
  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      axios.delete(`${API_URL}/${id}`)
        .then(() => setUsers(users.filter(user => user._id !== id)))
        .catch((error) => console.error("Error deleting user:", error));
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

  return (
    <motion.div 
      className="p-8 m-8 md:m-16 lg:m-32 rounded-3xl shadow-2xl mx-auto relative"
      style={{ 
        background: `linear-gradient(145deg, ${colors.mediumBlue}, ${colors.darkBlue})`,
        maxWidth: "1200px"
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence>
        {editingUser && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.darkBlue }}>Edit User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.mediumBlue }}>Name</label>
                  <input 
                    type="text" 
                    value={editedName} 
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2"
                    style={{ borderColor: colors.lightBlue, focusRing: colors.mediumBlue }}
                    placeholder="Name" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.mediumBlue }}>Email</label>
                  <input 
                    type="email" 
                    value={editedEmail} 
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2"
                    style={{ borderColor: colors.lightBlue, focusRing: colors.mediumBlue }}
                    placeholder="Email" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.mediumBlue }}>Role</label>
                  <select 
                    value={editedRole} 
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2"
                    style={{ borderColor: colors.lightBlue, focusRing: colors.mediumBlue }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <motion.button 
                  onClick={handleSaveEdit} 
                  className="flex-1 py-3 rounded-xl text-white font-medium flex items-center justify-center"
                  style={{ backgroundColor: colors.mediumBlue }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>
                <motion.button 
                  onClick={() => setEditingUser(null)} 
                  className="flex-1 py-3 rounded-xl text-white font-medium flex items-center justify-center"
                  style={{ backgroundColor: "#64748b" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="bg-white p-8 rounded-3xl shadow-lg"
        variants={itemVariants}
      >
        <motion.div className="flex items-center justify-center mb-6" variants={itemVariants}>
          <FaUsers size={32} style={{ color: colors.darkBlue }} className="mr-3" />
          <h2 className="text-3xl font-bold text-center" style={{ color: colors.darkBlue }}>
            User Management
          </h2>
        </motion.div>

        <motion.div 
          className="flex items-center mb-6 p-2 rounded-2xl" 
          style={{ backgroundColor: colors.sand, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
          variants={itemVariants}
        >
          <FaSearch size={20} className="mx-3" style={{ color: colors.darkBlue }} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 flex-grow bg-transparent border-none focus:outline-none text-gray-800"
            style={{ fontSize: "1.1rem" }}
          />
        </motion.div>

        {loading ? (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        ) : (
          <motion.div 
            className="overflow-hidden rounded-2xl shadow-lg"
            variants={itemVariants}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: colors.mediumBlue }}>
                  <th className="p-4 text-left text-white font-semibold">Name</th>
                  <th className="p-4 text-left text-white font-semibold">Email</th>
                  <th className="p-4 text-left text-white font-semibold">Role</th>
                  <th className="p-4 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr 
                        key={user._id} 
                        className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white" }}
                      >
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ 
                              backgroundColor: 
                                user.role === "Admin" ? colors.darkBlue : 
                                user.role === "Manager" ? colors.mediumBlue : colors.lightBlue,
                              color: "white"
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <motion.button 
                              onClick={() => handleEdit(user)}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-white text-sm"
                              style={{ backgroundColor: colors.lightBlue }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaUserEdit /> Edit
                            </motion.button>
                            <motion.button 
                              onClick={() => handleRemove(user._id)}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-white text-sm bg-red-500"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaUserMinus /> Remove
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No users found matching your search criteria
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        className="mt-6 text-center text-white text-sm opacity-80"
        variants={itemVariants}
      >
        {filteredUsers.length > 0 && (
          <p>Showing {filteredUsers.length} of {users.length} users</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AllUsers;