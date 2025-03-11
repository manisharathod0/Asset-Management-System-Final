import { useState } from "react";
import { motion } from "framer-motion";

const RequestNewAsset = () => {
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    quantity: 1,
    urgency: "",
    reason: "",
    requestedBy: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Asset Request Submitted:", formData);
    setFormData({
      assetName: "",
      assetType: "",
      quantity: 1,
      urgency: "",
      reason: "",
      requestedBy: "",
      department: "",
    });
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-100 py-30 px-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Request New Asset
        </h2>
        <motion.form 
          onSubmit={handleSubmit} 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className="block text-gray-700 mb-1">Asset Name</label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Asset Type</label>
            <input
              type="text"
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              min="1"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Urgency Level</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Urgency</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 mb-1">Reason for Request</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Requested By</label>
            <input
              type="text"
              name="requestedBy"
              value={formData.requestedBy}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <motion.button
              type="submit"
              className="w-full py-3 bg-[#3A6D8C] text-white rounded-lg hover:bg-[#001F3F] transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Request
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default RequestNewAsset;
