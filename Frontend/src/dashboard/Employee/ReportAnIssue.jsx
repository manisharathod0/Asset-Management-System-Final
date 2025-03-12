import { useState } from "react";
import { motion } from "framer-motion";

const ReportAnIssue = () => {
  const [issue, setIssue] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assets] = useState([
    { id: 1, name: "Dell Laptop" },
    { id: 2, name: "HP Printer" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Issue reported for ${selectedAsset}: ${issue}`);
    setIssue("");
    setSelectedAsset("");
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Select Asset</label>
          <select 
            value={selectedAsset} 
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none"
            required
          >
            <option value="">-- Select Asset --</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.name}>{asset.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Issue Description</label>
          <textarea 
            value={issue} 
            onChange={(e) => setIssue(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none"
            rows="4"
            placeholder="Describe the issue..."
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Submit Issue
        </button>
      </form>
    </motion.div>
  );
};

export default ReportAnIssue;