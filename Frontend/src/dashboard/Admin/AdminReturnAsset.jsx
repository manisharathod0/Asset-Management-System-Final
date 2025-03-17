import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // ✅ Import Axios

const AdminReturnAsset = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReturnedAssets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/assets/returned");
        setLogs(response.data);
      } catch (error) {
        setError("Error fetching returned assets");
      } finally {
        setLoading(false);
      }
    };

    fetchReturnedAssets();
  }, []);

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto mt-30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Returned Asset Log</h2>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset</th>
              <th className="p-3 border">Return Date</th>
              <th className="p-3 border">Condition</th>
              <th className="p-3 border">Employee</th>
              <th className="p-3 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <motion.tr 
                  key={log._id} 
                  className="text-center bg-gray-100 hover:bg-gray-200 transition"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <td className="p-3 border">{log.name}</td>
                  <td className="p-3 border">{new Date(log.returnDetails?.returnDate).toLocaleDateString()}</td>
                  <td className={`p-3 border font-semibold ${
                    log.returnDetails?.condition === "Good" ? "text-green-600" :
                    log.returnDetails?.condition === "Minor Damage" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>{log.returnDetails?.condition}</td>
                  <td className="p-3 border">{log.returnDetails?.returnedBy || "Unknown"}</td>
                  <td className="p-3 border">{log.returnDetails?.notes || "-"}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">No returned assets recorded</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminReturnAsset;
