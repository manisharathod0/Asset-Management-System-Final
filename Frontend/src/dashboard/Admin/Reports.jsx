import { useState } from "react";
import { FaDownload, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Reports = () => {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([
    { id: 1, title: "Asset Utilization Report", date: "2024-02-25", type: "Usage" },
    { id: 2, title: "Maintenance Summary", date: "2024-02-28", type: "Maintenance" },
    { id: 3, title: "Asset Allocation Report", date: "2024-03-02", type: "Allocation" },
  ]);

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      className="p-6 bg-white m-40 shadow-lg rounded-xl w-90vh mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2"> Reports
      </h2>
      
      <div className="flex gap-4 mb-4 justify-between">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
        <button className="bg-[#3A6D8C] text-white p-3 rounded-lg flex items-center gap-2 hover:bg-[#2b516c]">
          <FaDownload /> Download All Reports
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
            <th className="p-3 border">Title</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Type</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <motion.tr 
              key={report.id} 
              className="text-center bg-gray-100 hover:bg-gray-200 transition"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <td className="p-3 border">{report.title}</td>
              <td className="p-3 border">{report.date}</td>
              <td className="p-3 border font-semibold">{report.type}</td>
              <td className="p-3 border">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                   Download
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default Reports;
