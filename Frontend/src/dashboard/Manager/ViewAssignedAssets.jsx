import { useState } from "react";
import { motion } from "framer-motion";

const ViewAssignedAssets = () => {
  const [assignedAssets] = useState([
    {
      id: 1,
      assetName: "Dell Laptop",
      assetType: "Electronics",
      assignedTo: "John Doe",
      department: "IT",
      assignedDate: "2025-03-01",
      condition: "Good",
    },
    {
      id: 2,
      assetName: "Office Desk",
      assetType: "Furniture",
      assignedTo: "Jane Smith",
      department: "HR",
      assignedDate: "2025-02-20",
      condition: "Satisfactory",
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
        className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          View Assigned Assets
        </h2>
        <div className="overflow-x-auto">
          <motion.table
            className="w-full table-fixed border border-gray-300 rounded-lg shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <thead>
              <tr className="bg-[#3A6D8C] text-white">
                <th className="p-3">Asset Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned Date</th>
                <th className="p-3">Condition</th>
              </tr>
            </thead>
            <tbody>
              {assignedAssets.map((asset, index) => (
                <motion.tr
                  key={asset.id}
                  className={`border-b border-gray-300 text-center ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <td className="p-3">{asset.assetName}</td>
                  <td className="p-3">{asset.assetType}</td>
                  <td className="p-3">{asset.assignedTo}</td>
                  <td className="p-3">{asset.department}</td>
                  <td className="p-3">{asset.assignedDate}</td>
                  <td className="p-3">
                    <motion.span
                      className="px-4 py-1 rounded-full text-white font-semibold"
                      style={{
                        backgroundColor:
                          asset.condition === "Good" ? "#4CAF50" : "#F4A261",
                      }}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    >
                      {asset.condition}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ViewAssignedAssets;
