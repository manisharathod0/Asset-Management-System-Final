import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ReturnRequest = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch assets assigned to the current user
  const fetchAssets = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
    const token = user?.token;

    if (!token) {
      setError("Authentication token not found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/assign/my-assets", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch assets");
      }

      const data = await response.json();
      setAssets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAssets(); 
  }, []);

  const handleReturnRequest = async (assetId, assetName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    
    if (!token) {
      setError("Authentication token not found. Please login.");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create return log data
      const returnData = {
        assetId: assetId,
        name: assetName,
        returnDetails: {
          returnDate: new Date().toISOString(),
          condition: "Good", // Default condition
          returnedBy: user.name || user.email || "Current Employee", // Use user info from local storage
          notes: "Return requested by employee"
        }
      };
      
      // Send request to backend
      const response = await axios.post(
        "http://localhost:5000/api/return-logs", 
        returnData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        alert(`Return request submitted for asset: ${assetName}`);
        // Refresh the asset list to show updated status
        fetchAssets();
      } else {
        alert("Failed to submit return request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting return request:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to submit return request"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto mt-25"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Return Request</h2>
      
      {loading && <p className="text-center text-gray-600">Loading assets, please wait...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset</th>
              <th className="p-3 border">Assigned Date</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <motion.tr 
                  key={asset._id} 
                  className="text-center bg-gray-100 hover:bg-gray-200 transition"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <td className="p-3 border">{asset.asset?.name || "N/A"}</td>
                  <td className="p-3 border">{new Date(asset.assignedDate).toLocaleDateString()}</td>
                  <td className="p-3 border">
                    <button 
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => handleReturnRequest(asset.asset?._id, asset.asset?.name)}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Request Return"}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">No assets available for return</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default ReturnRequest;