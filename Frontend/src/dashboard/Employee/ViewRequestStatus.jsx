import { useState } from "react";
import { motion } from "framer-motion";

const ViewRequestStatus = () => {
  const [requests, setRequests] = useState([
    { id: 1, asset: "Dell Laptop", status: "Pending", date: "2024-02-20" },
    { id: 2, asset: "Office Chair", status: "Approved", date: "2024-02-18" },
    { id: 3, asset: "External Monitor", status: "Rejected", date: "2024-02-15" },
  ]);

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">View Request Status</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Asset</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Request Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <motion.tr 
                key={request.id} 
                className="text-center bg-gray-100 hover:bg-gray-200 transition"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <td className="p-3 border">{request.asset}</td>
                <td className={`p-3 border font-semibold ${
                  request.status === "Pending" ? "text-yellow-600" :
                  request.status === "Approved" ? "text-green-600" : "text-red-600"
                }`}>{request.status}</td>
                <td className="p-3 border">{request.date}</td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">No requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ViewRequestStatus;