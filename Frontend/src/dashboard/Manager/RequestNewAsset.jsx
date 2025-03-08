import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-30 px-6">
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Request New Asset
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
            <button
              type="submit"
              className="w-full py-3 bg-[#3A6D8C] text-white rounded-lg hover:bg-[#001F3F] transition duration-200"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestNewAsset;
