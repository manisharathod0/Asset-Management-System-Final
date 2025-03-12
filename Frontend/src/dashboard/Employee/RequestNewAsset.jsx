import { useState } from "react";
import { motion } from "framer-motion";

const RequestNewAsset = () => {
  const [formData, setFormData] = useState({ assetName: "", reason: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Request New Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Asset Name</label>
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]"
            placeholder="Enter asset name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Reason for Request</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]"
            placeholder="Explain why you need this asset"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#3A6D8C] text-white py-2 rounded-lg font-semibold hover:bg-[#31566F] transition"
        >
          Submit Request
        </button>
        {submitted && (
          <p className="text-center text-green-600 font-semibold mt-2">Request submitted successfully!</p>
        )}
      </form>
    </motion.div>
  );
};

export default RequestNewAsset;