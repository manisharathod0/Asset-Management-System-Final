import { useState, useEffect } from "react";
import { FaUserEdit, FaUserMinus } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Change this as per your backend route

const AllUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");

  // Fetch Users from Backend
  useEffect(() => {
    axios.get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
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

  return (
    <motion.div className="p-6 bg-white m-40 shadow-lg rounded-xl w-90vh mx-auto relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {editingUser && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-xl shadow-lg w-2/5 relative">
            <h3 className="text-xl font-bold mb-2">Edit User</h3>
            <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)}
              className="w-full p-2 border rounded mb-2" placeholder="Name" />
            <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)}
              className="w-full p-2 border rounded mb-2" placeholder="Email" />
            <select value={editedRole} onChange={(e) => setEditedRole(e.target.value)}
              className="w-full p-2 border rounded mb-2">
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Save
              </button>
              <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
        All Users
      </h2>

      <div className="flex gap-4 mb-4 justify-between">
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none" />
      </div>

      <motion.table className="w-full border-collapse border border-gray-300"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <motion.tr key={user._id} className="text-center bg-gray-100 hover:bg-gray-200 transition"
              initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <td className="p-3 border">{user.name}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">{user.role}</td>
              <td className="p-3 border flex justify-center gap-2">
                <button onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-1">
                  <FaUserEdit /> <span>Edit</span>
                </button>
                <button onClick={() => handleRemove(user._id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1">
                  <FaUserMinus /> <span>Remove</span>
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default AllUsers;
