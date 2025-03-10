import { useState } from "react";
import { motion } from "framer-motion"; 

const ViewMyAsset = () => {
  const [assets] = useState([
    { id: 1, name: "Dell Laptop", status: "Assigned", date: "2024-02-10" },
    { id: 2, name: "HP Printer", status: "Assigned", date: "2024-01-25" },
  ]);

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl w-90vh m-40 mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">View My Assets</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Asset</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Assigned Date</th>
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
                <td className="p-3 border font-semibold text-blue-600">{asset.status}</td>
                <td className="p-3 border">{asset.date}</td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">No assets assigned</td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ViewMyAsset;

