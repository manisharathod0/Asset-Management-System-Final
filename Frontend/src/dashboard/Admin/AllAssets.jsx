
import { useEffect, useState } from "react";
import axios from "axios";

const statusColors = {
  Available: "text-green-600",
  Assigned: "text-blue-600",
  "Under Maintenance": "text-red-600",
  Retired: "text-gray-600",
};

const AllAssets = () => {
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/assets");
      console.log("API Response:", response.data); // Log the response
      if (Array.isArray(response.data)) {
        setAssets(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
        setAssets([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/assets/${editingAsset._id}`, editingAsset);
      fetchAssets(); // Refresh the list
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mt-16">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Assets</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Asset Name</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <tr key={asset._id} className="text-center">
                <td className="p-3 border">{asset.name}</td>
                <td className="p-3 border">{asset.category}</td>
                <td className={`p-3 border font-semibold ${statusColors[asset.status]}`}>
                  {asset.status}
                </td>
                <td className="p-3 border">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(asset)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                No assets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editingAsset.name}
              onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editingAsset.category}
              onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
            />
            <select
              className="border p-2 w-full mb-4"
              value={editingAsset.status}
              onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAssets;