

import { useEffect, useState } from "react";
import axios from "axios";

const statusColors = {
  Available: "text-green-600",
  Assigned: "text-blue-600",
  "Under Maintenance": "text-red-600",
  Retired: "text-gray-600",
  Returned: "text-yellow-600",
};

const AllAssets = () => {
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/assets");
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setAssets(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
        setAssets([]);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset({
      ...asset,
      newImage: null
    });
    setImagePreview(asset.image ? `http://localhost:5000/uploads/${asset.image}` : null);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingAsset({ ...editingAsset, newImage: file });
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editingAsset.name);
      formData.append("category", editingAsset.category);
      formData.append("status", editingAsset.status);
      formData.append("description", editingAsset.description || "");
      formData.append("expiryDate", editingAsset.expiryDate || "");
      formData.append("quantity", editingAsset.quantity.toString()); // Ensure quantity is a string
      
      if (editingAsset.newImage) {
        formData.append("image", editingAsset.newImage);
      }

      await axios.put(
        `http://localhost:5000/api/assets/${editingAsset._id}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      await fetchAssets(); // Refresh the list
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDownload = async () => {
    try {
      // Using axios to get the CSV file
      const response = await axios.get("http://localhost:5000/api/assets/export", {
        responseType: 'blob', // Important for handling file downloads
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'assets.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading assets:", error);
      alert("Failed to download assets. Please try again.");
    }
  };

  // Filter assets based on selected status
  const filteredAssets = filterStatus === "All" 
    ? assets 
    : assets.filter(asset => asset.status === filterStatus);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mt-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">All Assets</h2>
        <div className="flex space-x-2">
          <select 
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Returned">Returned</option>
            <option value="Retired">Retired</option>
          </select>
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Asset Name</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Expiry Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset._id} className="text-center hover:bg-gray-50">
                  <td className="p-3 border">
                    {asset.image ? (
                      <div className="w-16 h-16 mx-auto">
                        <img 
                          src={`http://localhost:5000/uploads/${asset.image}`} 
                          alt={asset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mx-auto">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 border">{asset.name}</td>
                  <td className="p-3 border">{asset.category}</td>
                  <td className={`p-3 border font-semibold ${statusColors[asset.status]}`}>
                    {asset.status}
                  </td>
                  <td className="p-3 border">{asset.quantity || 1}</td>
                  <td className="p-3 border">{formatDate(asset.expiryDate)}</td>
                  <td className="p-3 border">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(asset)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  {assets.length > 0 ? "No assets match the selected filter." : "No assets found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Asset Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={editingAsset.category}
                  onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <select
                  className="border p-2 w-full rounded"
                  value={editingAsset.status}
                  onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Returned">Returned</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  className="border p-2 w-full rounded"
                  value={editingAsset.quantity || 1}
                  onChange={(e) => setEditingAsset({ ...editingAsset, quantity: e.target.value })}
                  min="1"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={editingAsset.expiryDate ? editingAsset.expiryDate.split('T')[0] : ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, expiryDate: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Update Image</label>
                <input
                  type="file"
                  className="border p-2 w-full rounded"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
            
            {imagePreview && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Image Preview</label>
                <div className="w-40 h-40 border rounded flex items-center justify-center overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Asset preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                className="border p-2 w-full rounded"
                value={editingAsset.description || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded mr-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"}`}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
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
