
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ViewRequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch asset request data from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/request-asset");
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load request data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <motion.div 
      className="p-8 bg-white shadow-xl rounded-xl max-w-5xl mx-auto mt-25"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Request Status</h2>
      
      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <th className="px-6 py-3 border">Asset</th>
                <th className="px-6 py-3 border">Status</th>
                <th className="px-6 py-3 border">Request Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <motion.tr 
                    key={request._id} 
                    className="text-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <td className="px-6 py-4 border">{request.assetName}</td>
                    <td className={`px-6 py-4 border font-semibold ${
                      request.status === "Pending"
                        ? "text-yellow-600"
                        : request.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {request.status}
                    </td>
                    <td className="px-6 py-4 border">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ViewRequestStatus;
