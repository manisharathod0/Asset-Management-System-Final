import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ViewMyAsset = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssets = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
    const token = user?.token;

    if (!token) {
      setError("Authentication token not found. Please login.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/assign/my-assets", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch assets");
      }

      const data = await response.json();
      setAssets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-4xl mx-auto mt-20 overflow-x-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">View My Assets</h2>
      {loading && <p className="text-center text-gray-600">Loading assets, please wait...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Assigned Date</th>
              <th className="p-3 border">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <motion.tr 
                  key={asset._id} 
                  className="text-center bg-gray-100 hover:bg-gray-200 transition"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                 <td className="p-3 border">{asset.asset?.name || "N/A"}</td>
<td className="p-3 border font-semibold text-blue-600">{asset.asset?.status || "N/A"}</td>

                  <td className="p-3 border">{new Date(asset.assignedDate).toLocaleDateString()}</td>
                  <td className="p-3 border">{new Date(asset.dueDate).toLocaleDateString()}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">No assets assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default ViewMyAsset;