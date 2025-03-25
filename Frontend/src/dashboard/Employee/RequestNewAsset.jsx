

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RequestNewAsset = () => {
  const [formData, setFormData] = useState({
    assetId: "",
    assetName: "",
    category: "",
    reason: "",
  });
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/request-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Submission failed.");
      } else {
        // Show toast notification
        setToast({ visible: true, message: "Request submitted successfully!" });
        // Optionally clear the form after submission
        setFormData({
          assetId: "",
          assetName: "",
          category: "",
          reason: "",
        });
        // Hide the toast after 3 seconds
        setTimeout(() => setToast({ visible: false, message: "" }), 3000);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-white shadow-2xl rounded-xl max-w-3xl mx-auto mt-25 relative">
      <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">
        Request New Asset
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Asset ID</label>
          <input
            type="text"
            name="assetId"
            value={formData.assetId}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter asset ID"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Asset Name</label>
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter asset name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter asset category"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Reason for Request</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Explain why you need this asset"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-bold hover:shadow-xl transition transform hover:scale-105"
        >
          Submit Request
        </button>
        {error && (
          <p className="text-center text-red-600 font-semibold mt-4">
            {error}
          </p>
        )}
      </form>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestNewAsset;
