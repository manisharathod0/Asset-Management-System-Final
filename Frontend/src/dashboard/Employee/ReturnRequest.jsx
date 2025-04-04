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

  // Format the MongoDB ID to be more user-friendly
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assign/my-assets`, {
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/return-logs/my-returns`, {
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
       `${import.meta.env.VITE_BACKEND_URL}/api/return-logs`, 
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
      className="flex flex-col gap-8 mx-auto max-w-5xl mt-25 px-4 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <motion.div
        className="bg-[#001F3F] text-white p-6 rounded-2xl shadow-lg mb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-center">Asset Management System</h1>
        <p className="text-center text-[#EAD8B1] mt-2">Manage your assigned assets and return requests</p>
      </motion.div>

      {/* Return Request Form */}
      <motion.div 
        className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#3A6D8C]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-1 bg-[#3A6D8C] rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-[#001F3F]">My Assigned Assets</h2>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-[#6A9AB0] border-b-[#3A6D8C] border-l-[#EAD8B1] border-r-[#001F3F] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#3A6D8C] font-medium">Loading assets...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#3A6D8C] text-white">
                  <th className="p-4 text-left">Asset ID</th>
                  <th className="p-4 text-left">Asset Name</th>
                  <th className="p-4 text-left">Assigned Date</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {assets.length > 0 ? (
                  assets.map((asset, index) => {
                    const returnStatus = getReturnRequestStatus(asset.asset?._id);
                    return (
                      <motion.tr 
                        key={asset._id} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#EAD8B1]/10'} hover:bg-[#6A9AB0]/10 transition-colors`}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <td className="p-4 border-b border-gray-200 font-medium text-[#001F3F]">{formatAssetId(asset.asset?._id)}</td>
                        <td className="p-4 border-b border-gray-200">{asset.asset?.name || "N/A"}</td>
                        <td className="p-4 border-b border-gray-200">{new Date(asset.assignedDate).toLocaleDateString()}</td>
                        <td className="p-4 border-b border-gray-200 text-center">
                          {returnStatus ? (
                            <span className={`inline-block px-4 py-2 rounded-full font-medium ${
                              returnStatus === "approved" ? "bg-green-100 text-green-800 border border-green-300" : 
                              returnStatus === "rejected" ? "bg-red-100 text-red-800 border border-red-300" : 
                              "bg-[#EAD8B1] text-[#001F3F] border border-[#EAD8B1]"
                            }`}>
                              {returnStatus === "approved" ? "Approved" : 
                               returnStatus === "rejected" ? "Rejected" : 
                               "Pending"}
                            </span>
                          ) : (
                            <button 
                              className="bg-[#6A9AB0] hover:bg-[#3A6D8C] text-white px-4 py-2 rounded-full font-medium transition-colors duration-300 shadow-md hover:shadow-lg flex items-center mx-auto"
                              onClick={() => handleReturnRequest(asset.asset?._id, asset.asset?.name)}
                              disabled={submitting}
                            >
                              {submitting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : "Request Return"}
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#6A9AB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-3 font-medium">No assets available for return</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Return Request Status */}
      <motion.div 
        className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#6A9AB0]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-1 bg-[#6A9AB0] rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-[#001F3F]">My Return Requests</h2>
        </div>
        
        {requestsLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-[#6A9AB0] border-b-[#3A6D8C] border-l-[#EAD8B1] border-r-[#001F3F] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#3A6D8C] font-medium">Loading requests...</p>
            </div>
          </div>
        )}
        
        {!requestsLoading && (
          <div className="overflow-hidden rounded-xl shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#6A9AB0] text-white">
                  <th className="p-4 text-left">Asset ID</th>
                  <th className="p-4 text-left">Asset Name</th>
                  <th className="p-4 text-left">Return Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {returnRequests.length > 0 ? (
                  returnRequests.map((request, index) => (
                    <motion.tr 
                      key={request._id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#EAD8B1]/10'} hover:bg-[#6A9AB0]/10 transition-colors`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <td className="p-4 border-b border-gray-200 font-medium text-[#001F3F]">{formatAssetId(request.assetId)}</td>
                      <td className="p-4 border-b border-gray-200">{request.name}</td>
                      <td className="p-4 border-b border-gray-200">{new Date(request.returnDetails?.returnDate).toLocaleDateString()}</td>
                      <td className="p-4 border-b border-gray-200 text-center">
                        <span className={`inline-block px-4 py-2 rounded-full font-medium ${
                          request.status === "approved" ? "bg-green-100 text-green-800 border border-green-300" :
                          request.status === "rejected" ? "bg-red-100 text-red-800 border border-red-300" :
                          "bg-[#EAD8B1] text-[#001F3F] border border-[#EAD8B1]"
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        {request.status !== "pending" && request.processedDate ? (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${request.status === "approved" ? "text-green-600" : "text-red-600"}`} viewBox="0 0 20 20" fill="currentColor">
                              {request.status === "approved" ? 
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /> :
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              }
                            </svg>
                            <span>
                              {request.status === "approved" ? "Approved" : "Rejected"} on {new Date(request.processedDate).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#6A9AB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Awaiting admin response</span>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#6A9AB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-3 font-medium">No return requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {/* Footer */}
      <motion.div
        className="bg-[#001F3F] text-white p-4 rounded-2xl shadow-lg text-center mt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-[#EAD8B1]">Asset Management System • {new Date().getFullYear()}</p>
      </motion.div>
    </motion.div>
  );
};

export default ReturnRequest;