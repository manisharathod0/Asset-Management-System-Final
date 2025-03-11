import { useState } from "react";
import { motion } from "framer-motion";

const QRCodeLogs = () => {
  const [logs] = useState([
    {
      id: 1,
      assetName: "Laptop",
      scannedBy: "John Doe",
      department: "IT",
      scanDate: "2025-03-04",
      location: "Head Office",
    },
    {
      id: 2,
      assetName: "Projector",
      scannedBy: "Jane Smith",
      department: "HR",
      scanDate: "2025-03-03",
      location: "Conference Room",
    },
  ]);

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-6"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          QR Code Logs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-[#3A6D8C] text-white text-left">
                <th className="py-3 px-5">Asset Name</th>
                <th className="py-3 px-5">Scanned By</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Scan Date</th>
                <th className="py-3 px-5">Location</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  className="border-t hover:bg-gray-100 transition duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <td className="py-3 px-5">{log.assetName}</td>
                  <td className="py-3 px-5">{log.scannedBy}</td>
                  <td className="py-3 px-5">{log.department}</td>
                  <td className="py-3 px-5 text-[#6A9AB0] font-semibold">{log.scanDate}</td>
                  <td className="py-3 px-5">{log.location}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRCodeLogs;
