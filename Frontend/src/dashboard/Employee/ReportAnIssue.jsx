

import { useState } from "react";
import { motion } from "framer-motion";

const ReportAnIssue = () => {
  const [assetName, setAssetName] = useState("");
  const [assetId, setAssetId] = useState("");
  const [category, setCategory] = useState("");
  const [issue, setIssue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Issue reported Successfully for ${assetName} (ID: ${assetId}, Category: ${category}): ${issue}`);
    // Reset the form fields
    setAssetName("");
    setAssetId("");
    setCategory("");
    setIssue("");
  };

  return (
    <motion.div 
      className="pt-10 mt-25 pb-10 px-6 bg-white shadow-2xl rounded-2xl max-w-3xl mx-auto my-10 border border-blue-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Asset Name</label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="Enter asset name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            required
          />
        </div>
        {/* Asset ID */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Asset ID</label>
          <input
            type="text"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter asset ID"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            required
          />
        </div>
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            required
          />
        </div>
        {/* Issue Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Issue Description</label>
          <textarea 
            value={issue} 
            onChange={(e) => setIssue(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            rows="4"
            placeholder="Describe the issue..."
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="bg-red-500 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-red-600 transition-colors"
        >
          Submit Issue
        </button>
      </form>
    </motion.div>
  );
};

export default ReportAnIssue;
