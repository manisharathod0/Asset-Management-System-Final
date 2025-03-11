import { useState } from "react";
import { motion } from "framer-motion";

const AssetConditionReports = () => {
  const [reports] = useState([
    {
      id: 1,
      assetName: "Laptop",
      assetType: "Electronics",
      assignedTo: "John Doe",
      department: "IT",
      condition: "Good",
      lastChecked: "2025-02-20",
    },
    {
      id: 2,
      assetName: "Office Chair",
      assetType: "Furniture",
      assignedTo: "Jane Smith",
      department: "HR",
      condition: "Slightly Worn",
      lastChecked: "2025-02-18",
    },
  ]);

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Good":
        return "bg-green-500";
      case "Slightly Worn":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-6"
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
          Asset Condition Reports
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#3A6D8C] text-white text-left">
                <th className="p-3">Asset Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Department</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  className={`border-b border-gray-300 text-left ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <td className="p-3">{report.assetName}</td>
                  <td className="p-3">{report.assetType}</td>
                  <td className="p-3">{report.assignedTo}</td>
                  <td className="p-3">{report.department}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${getConditionColor(report.condition)}`}>
                      {report.condition}
                    </span>
                  </td>
                  <td className="p-3 text-[#6A9AB0] font-semibold">{report.lastChecked}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssetConditionReports;
