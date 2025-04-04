

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ViewRequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const colors = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    cream: "#EAD8B1"
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/request-asset`);
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError("Failed to load request data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(request => request.status.toLowerCase() === activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-8 rounded-3xl mx-auto mt-25 h-[80vh] max-w-5xl"
      style={{ backgroundColor: colors.cream, boxShadow: "0 10px 25px rgba(0,31,63,0.1)" }}
    >
      <h2 className="text-4xl font-bold mb-6 text-center" style={{ color: colors.darkBlue }}>
        Asset Request Status
      </h2>

      <div className="mb-6 flex justify-center gap-2">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-full font-medium text-sm"
            style={{
              backgroundColor: activeTab === tab ? colors.mediumBlue : colors.lightBlue,
              color: activeTab === tab ? colors.cream : colors.darkBlue,
              boxShadow: activeTab === tab ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" 
               style={{ borderColor: `${colors.mediumBlue} transparent ${colors.mediumBlue} transparent` }}>
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-6 rounded-xl" style={{ backgroundColor: "rgba(234, 216, 177, 0.5)" }}>
          <p style={{ color: colors.darkBlue }}>{error}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl" style={{ boxShadow: "0 6px 12px rgba(0,31,63,0.1)" }}>
          {filteredRequests.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr style={{ backgroundColor: colors.darkBlue }}>
                  <th className="px-6 py-4 rounded-tl-2xl" style={{ color: colors.cream }}>Asset</th>
                  <th className="px-6 py-4" style={{ color: colors.cream }}>Status</th>
                  <th className="px-6 py-4 rounded-tr-2xl" style={{ color: colors.cream }}>Request Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr 
                    key={request._id || index}
                    style={{ backgroundColor: index % 2 === 0 ? "rgba(255,255,255,1)" : colors.lightBlue + "15" }}
                  >
                    <td className="px-6 py-4 border-b" style={{ borderColor: colors.cream }}>
                      <span className="font-medium" style={{ color: colors.darkBlue }}>
                        {request.assetName}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b" style={{ borderColor: colors.cream }}>
                      <span 
                        className="px-3 py-1 rounded-full text-sm inline-block font-medium"
                        style={{
                          backgroundColor: request.status === "Pending"
                            ? "rgba(255,215,0,0.3)"
                            : request.status === "Approved"
                            ? "rgba(34,197,94,0.3)"
                            : "rgba(239,68,68,0.3)",
                          color: request.status === "Pending"
                            ? "#B45309"
                            : request.status === "Approved"
                            ? "#166534"
                            : "#B91C1C"
                        }}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b" style={{ borderColor: colors.cream }}>
                      <span style={{ color: colors.mediumBlue }}>
                        {new Date(request.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center" style={{ backgroundColor: "rgba(255,255,255,1)" }}>
              <div className="p-4 rounded-xl inline-block" style={{ backgroundColor: "rgba(234, 216, 177, 0.4)" }}>
                <p style={{ color: colors.mediumBlue }}>No {activeTab !== "all" ? activeTab : ""} requests found.</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 text-center text-sm" style={{ color: colors.mediumBlue }}>
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </motion.div>
  );
};

export default ViewRequestStatus;


