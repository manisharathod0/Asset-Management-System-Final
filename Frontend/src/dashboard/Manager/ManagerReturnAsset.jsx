import { useState } from "react";
import { motion } from "framer-motion";

const ManagerReturnAsset = () => {
  const [assets] = useState([
    {
      id: 1,
      assetName: "Laptop",
      assetType: "Electronics",
      assignedTo: "John Doe",
      department: "IT",
      condition: "Good",
      returnStatus: "Pending",
    },
    {
      id: 2,
      assetName: "Office Chair",
      assetType: "Furniture",
      assignedTo: "Jane Smith",
      department: "HR",
      condition: "Slightly Worn",
      returnStatus: "Pending",
    },
  ]);

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-100 py-30 px-6"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-5xl w-full p-8 bg-white shadow-lg rounded-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Return Asset
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#3A6D8C] text-white">
                <th className="p-3">Asset Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Department</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Return Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <motion.tr
                  key={asset.id}
                  className={`border-b border-gray-300 text-center ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <td className="p-3">{asset.assetName}</td>
                  <td className="p-3">{asset.assetType}</td>
                  <td className="p-3">{asset.assignedTo}</td>
                  <td className="p-3">{asset.department}</td>
                  <td className="p-3">{asset.condition}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-white font-semibold text-sm"
                      style={{ backgroundColor: asset.returnStatus === "Pending" ? "#F59E0B" : "#22C55E" }}>
                      {asset.returnStatus}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManagerReturnAsset;
