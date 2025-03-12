import { useState } from "react";
import { motion } from "framer-motion";

const ReturnRequest = () => {
  const [assets] = useState([
    { id: 1, name: "Dell Laptop", date: "2024-02-10" },
    { id: 2, name: "HP Printer", date: "2024-01-25" },
  ]);

  const handleReturnRequest = (assetId) => {
    alert(`Return request submitted for asset ID: ${assetId}`);
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Return Request</h2>
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
                key={asset.id} 
                className="text-center bg-gray-100 hover:bg-gray-200 transition"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <td className="p-3 border">{asset.name}</td>
                <td className="p-3 border">{asset.date}</td>
                <td className="p-3 border">
                  <button 
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleReturnRequest(asset.id)}
                  >
                    Request Return
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
    </motion.div>
  );
};

export default ReturnRequest;