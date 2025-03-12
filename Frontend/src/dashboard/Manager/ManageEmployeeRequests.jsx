import { useState } from "react";
import { motion } from "framer-motion";

const ManageEmployeeRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, employee: "John Doe", asset: "Laptop", status: "Pending" },
    { id: 2, employee: "Jane Smith", asset: "Monitor", status: "Approved" },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Manage Employee Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-[#3A6D8C] text-white text-left">
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5">Asset</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <motion.tr 
                  key={req.id} 
                  className="border-t hover:bg-gray-100 transition duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-3 px-5">{req.employee}</td>
                  <td className="py-3 px-5">{req.asset}</td>
                  <td
                    className={`py-3 px-5 font-semibold ${
                      req.status === "Pending"
                        ? "text-yellow-600"
                        : req.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {req.status}
                  </td>
                  <td className="py-3 px-5">
                    <motion.select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="p-2 border rounded-md bg-white focus:ring-2 focus:ring-[#6A9AB0] cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </motion.select>
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

export default ManageEmployeeRequests;
