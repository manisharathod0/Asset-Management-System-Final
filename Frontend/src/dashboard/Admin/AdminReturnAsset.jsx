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
      className="p-8 rounded-xl max-w-5xl mx-auto mt-25"
      style={{ background: 'linear-gradient(to bottom, #EAD8B1, #FFFFFF)' }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4" style={{ borderColor: '#001F3F' }}>
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#001F3F' }}>
          Return Requests Management
        </h2>

        {loading && (
          <div className="text-center p-4">
            <div className="inline-block p-3 rounded-full" style={{ backgroundColor: '#3A6D8C' }}>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-2" style={{ color: '#3A6D8C' }}>Loading return requests...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center p-4 mb-4 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#001F3F' }}>
                <th className="p-3 text-white font-semibold">Asset ID</th>
                <th className="p-3 text-white font-semibold">Asset Name</th>
                <th className="p-3 text-white font-semibold">Return Date</th>
                <th className="p-3 text-white font-semibold">Condition</th>
                <th className="p-3 text-white font-semibold">Employee Name</th>
                <th className="p-3 text-white font-semibold">Status</th>
                <th className="p-3 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <motion.tr 
                    key={log._id} 
                    className="text-center hover:bg-gray-50 transition-colors"
                    style={{ backgroundColor: index % 2 === 0 ? '#f8f8f8' : 'white' }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="p-3 border-b" style={{ borderColor: '#EAD8B1' }}>
                      <span className="font-mono font-medium px-2 py-1 rounded" style={{ backgroundColor: '#EAD8B1', color: '#001F3F' }}>
                        {formatAssetId(log.assetId)}
                      </span>
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: '#EAD8B1' }}>{log.name}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#EAD8B1' }}>
                      {log.returnDetails?.returnDate 
                        ? new Date(log.returnDetails.returnDate).toLocaleDateString() 
                        : "N/A"
                      }
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: '#EAD8B1' }}>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        log.returnDetails?.condition === "Good" ? "bg-green-100 text-green-800" :
                        log.returnDetails?.condition === "Minor Damage" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {log.returnDetails?.condition || "Unknown"}
                      </span>
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: '#EAD8B1' }}>{getEmployeeName(log.employeeId)}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#EAD8B1' }}>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        log.status === "approved" ? "bg-green-100 text-green-800" :
                        log.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {log.status ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : "Pending"}
                      </span>
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: '#EAD8B1' }}>
                      {!log.status || log.status === "pending" ? (
                        <div className="flex gap-2 justify-center">
                          <button 
                            className="px-3 py-1 rounded-lg text-white text-sm transition-all duration-200 transform hover:scale-105"
                            style={{ backgroundColor: '#3A6D8C' }}
                            onClick={() => handleApproveReject(log._id, "approved")}
                            disabled={processing}
                          >
                            Approve
                          </button>
                          <button 
                            className="px-3 py-1 rounded-lg text-white text-sm transition-all duration-200 transform hover:scale-105"
                            style={{ backgroundColor: '#6A9AB0' }}
                            onClick={() => handleApproveReject(log._id, "rejected")}
                            disabled={processing}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-sm">
                          {log.status === "approved" ? "Approved" : "Rejected"} 
                          {log.processedDate ? ` on ${new Date(log.processedDate).toLocaleDateString()}` : ""}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center" style={{ color: '#6A9AB0' }}>
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="font-medium">No return requests found</p>
                      <p className="text-sm mt-1">All processed requests will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminReturnAsset;