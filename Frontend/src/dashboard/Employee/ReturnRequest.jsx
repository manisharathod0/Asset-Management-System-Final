
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ReturnRequest = () => {
  const [assets, setAssets] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get the current user
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = user?.token;

  // Format the MongoDB ID to be more user-friendly - same as in AdminReturnAsset.jsx
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

  // Fetch assets assigned to the current user
  const fetchAssets = async () => {
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

  // Fetch return requests made by the current user
  const fetchMyReturnRequests = async () => {
    if (!token) {
      setRequestsLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/return-logs/my-returns", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReturnRequests(response.data);
    } catch (error) {
      console.error("Error fetching return requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => { 
    fetchAssets();
    fetchMyReturnRequests();
  }, []);

  const handleReturnRequest = async (assetId, assetName) => {
    if (!token) {
      setError("Authentication token not found. Please login.");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Check if this asset already has a pending return request
      const existingRequest = returnRequests.find(
        req => req.assetId === assetId && req.status === "pending"
      );
      
      if (existingRequest) {
        alert("You already have a pending return request for this asset.");
        return;
      }
      
      // Create return log data
      const returnData = {
        assetId: assetId,
        name: assetName,
        returnDetails: {
          returnDate: new Date().toISOString(),
          condition: "Good", // Default condition
          returnedBy: user.name || user.email || "Current Employee", 
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
        // Refresh both lists
        fetchMyReturnRequests();
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

  // Check if an asset has a return request
  const getReturnRequestStatus = (assetId) => {
    const request = returnRequests.find(req => req.assetId === assetId);
    return request ? request.status : null;
  };

  return (
    <motion.div 
      className="flex flex-col gap-8 mx-auto max-w-4xl mt-25"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Return Request Form */}
      <motion.div 
        className="p-6 bg-white shadow-lg rounded-xl"
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
                <th className="p-3 border">Asset ID</th>
                <th className="p-3 border">Asset Name</th>
                <th className="p-3 border">Assigned Date</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map((asset) => {
                  const returnStatus = getReturnRequestStatus(asset.asset?._id);
                  return (
                    <motion.tr 
                      key={asset._id} 
                      className="text-center bg-gray-100 hover:bg-gray-200 transition"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <td className="p-3 border">{formatAssetId(asset.asset?._id)}</td>
                      <td className="p-3 border">{asset.asset?.name || "N/A"}</td>
                      <td className="p-3 border">{new Date(asset.assignedDate).toLocaleDateString()}</td>
                      <td className="p-3 border">
                        {returnStatus ? (
                          <span className={`inline-block px-3 py-1 rounded ${
                            returnStatus === "approved" ? "bg-green-100 text-green-800" : 
                            returnStatus === "rejected" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {returnStatus === "approved" ? "Approved" : 
                             returnStatus === "rejected" ? "Rejected" : 
                             "Pending"}
                          </span>
                        ) : (
                          <button 
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => handleReturnRequest(asset.asset?._id, asset.asset?.name)}
                            disabled={submitting}
                          >
                            {submitting ? "Submitting..." : "Request Return"}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">No assets available for return</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Return Request Status */}
      <motion.div 
        className="p-6 bg-white shadow-lg rounded-xl mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">My Return Requests</h2>
        
        {requestsLoading && <p className="text-center text-gray-600">Loading requests, please wait...</p>}
        
        {!requestsLoading && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#3A6D8C] text-white">
                <th className="p-3 border">Asset ID</th>
                <th className="p-3 border">Asset Name</th>
                <th className="p-3 border">Return Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Details</th>
              </tr>
            </thead>
            <tbody>
              {returnRequests.length > 0 ? (
                returnRequests.map((request) => (
                  <motion.tr 
                    key={request._id} 
                    className="text-center bg-gray-100 hover:bg-gray-200 transition"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <td className="p-3 border">{formatAssetId(request.assetId)}</td>
                    <td className="p-3 border">{request.name}</td>
                    <td className="p-3 border">{new Date(request.returnDetails?.returnDate).toLocaleDateString()}</td>
                    <td className={`p-3 border font-semibold ${
                      request.status === "approved" ? "text-green-600" :
                      request.status === "rejected" ? "text-red-600" :
                      "text-yellow-600"
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </td>
                    <td className="p-3 border">
                      {request.status !== "pending" && request.processedDate ? (
                        <span>
                          {request.status === "approved" ? "Approved" : "Rejected"} on {new Date(request.processedDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>Awaiting admin response</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">No return requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReturnRequest;