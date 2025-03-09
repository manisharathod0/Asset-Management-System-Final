import { useState } from "react";
import { FaDownload, FaTools } from "react-icons/fa";
import { motion } from "framer-motion";

const RepairStatus = () => {
  const [search, setSearch] = useState("");
  const [repairLogs, setRepairLogs] = useState([
    { id: 1, asset: "Laptop", issue: "Battery not charging", date: "2024-02-20", status: "Logged" },
    { id: 2, asset: "Printer", issue: "Paper jam", date: "2024-02-22", status: "In Progress" },
    { id: 3, asset: "Monitor", issue: "Screen flickering", date: "2024-02-23", status: "Completed" },
  ]);

  const filteredLogs = repairLogs.filter(entry => 
    entry.asset.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      className="p-6 bg-white m-40 shadow-lg rounded-xl w-90vh mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2"> Repair Status
      </h2>
      
      <div className="flex gap-4 mb-4 justify-between">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
        <button className="bg-[#3A6D8C] text-white p-3 rounded-lg flex items-center gap-2 hover:bg-[#2b516c]">
          <FaDownload /> Download Report
        </button>
      </div>

      <motion.table 
        className="w-full border-collapse border border-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Asset</th>
            <th className="p-3 border">Issue</th>
            <th className="p-3 border">Date Logged</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((entry) => (
            <motion.tr 
              key={entry.id} 
              className="text-center bg-gray-100 hover:bg-gray-200 transition"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <td className="p-3 border">{entry.asset}</td>
              <td className="p-3 border">{entry.issue}</td>
              <td className="p-3 border">{entry.date}</td>
              <td className={`p-3 border font-semibold ${
                entry.status === "Completed" ? "text-green-600" : 
                entry.status === "In Progress" ? "text-orange-600" : "text-red-600"
              }`}>
                {entry.status}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default RepairStatus;
