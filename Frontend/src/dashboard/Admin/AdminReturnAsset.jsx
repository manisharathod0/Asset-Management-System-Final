import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AdminReturnAsset = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch both return logs and users data
  useEffect(() => {
    fetchReturnedAssets();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchReturnedAssets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      const response = await axios.get("http://localhost:5000/api/return-logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching return logs:", error);
      setError(error.response?.data?.message || "Failed to fetch return logs");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (logId, status) => {
    try {
      setProcessing(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await axios.patch(
        `http://localhost:5000/api/return-logs/${logId}`,
        { 
          status,
          processedBy: user.name || user.email,
          processedDate: new Date().toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        // Refresh the list
        fetchReturnedAssets();
      }
    } catch (error) {
      console.error(`Error ${status} return request:`, error);
      alert(`Failed to ${status} return request. Please try again.`);
    } finally {
      setProcessing(false);
    }
  };

  // Format the MongoDB ID to be more user-friendly - same as in AllAssets.jsx
  const formatAssetId = (id) => {
    if (!id) return "N/A";
    
    // Convert to string to ensure we can use string methods
    const idStr = String(id);
    
    // Check if it's a valid string to operate on
    if (idStr.length < 6) {
      return `AST-${idStr}`;
    }
    
    // Take the last 6 characters of the ID and uppercase them
    const shortId = idStr.slice(-6).toUpperCase();
    return `AST-${shortId}`;
  };

  // Find employee name by ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return "Unknown";
    
    const user = users.find(user => user._id === employeeId);
    return user ? user.name : "Unknown";
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-5xl mx-auto mt-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Return Requests Management</h2>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset ID</th>
              <th className="p-3 border">Asset Name</th>
              <th className="p-3 border">Return Date</th>
              <th className="p-3 border">Condition</th>
              <th className="p-3 border">Employee Name</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <motion.tr 
                  key={log._id} 
                  className="text-center bg-gray-100 hover:bg-gray-200 transition"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <td className="p-3 border">{formatAssetId(log.assetId)}</td>
                  <td className="p-3 border">{log.name}</td>
                  <td className="p-3 border">
                    {log.returnDetails?.returnDate 
                      ? new Date(log.returnDetails.returnDate).toLocaleDateString() 
                      : "N/A"
                    }
                  </td>
                  <td className={`p-3 border font-semibold ${
                    log.returnDetails?.condition === "Good" ? "text-green-600" :
                    log.returnDetails?.condition === "Minor Damage" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {log.returnDetails?.condition || "Unknown"}
                  </td>
                  <td className="p-3 border">{getEmployeeName(log.employeeId)}</td>
                  <td className={`p-3 border font-semibold ${
                    log.status === "approved" ? "text-green-600" :
                    log.status === "rejected" ? "text-red-600" :
                    "text-blue-600"
                  }`}>
                    {log.status ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : "Pending"}
                  </td>
                  <td className="p-3 border">
                    {!log.status || log.status === "pending" ? (
                      <div className="flex gap-2 justify-center">
                        <button 
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                          onClick={() => handleApproveReject(log._id, "approved")}
                          disabled={processing}
                        >
                          Approve
                        </button>
                        <button 
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                          onClick={() => handleApproveReject(log._id, "rejected")}
                          disabled={processing}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        {log.status === "approved" ? "Approved" : "Rejected"} 
                        {log.processedDate ? ` on ${new Date(log.processedDate).toLocaleDateString()}` : ""}
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">No return requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminReturnAsset;