
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const statusColors = {
  Available: "text-green-600",
  Assigned: "text-blue-600",
  "Under Maintenance": "text-red-600",
  Retired: "text-gray-600",
  Returned: "text-yellow-600",
};

const AllAssets = () => {
  const qrRef = useRef(null);
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [qrCodeModalOpen, setQRCodeModalOpen] = useState(false);
  const [selectedAssetForQR, setSelectedAssetForQR] = useState(null);

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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const downloadQRCode = (assetId) => {
    const qrCodeContainer = document.getElementById(`qr-${assetId}`);
    
    if (!qrCodeContainer) {
      console.error("QR Code container not found!");
      return;
    }
  
    const qrCanvas = qrCodeContainer.querySelector('canvas');
    
    if (!qrCanvas) {
      console.error("QR Code canvas not found!");
      return;
    }
  
    try {
      const url = qrCanvas.toDataURL("image/png");
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${assetId}.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Failed to download QR code. Please try again.");
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
      formData.append("quantity", editingAsset.quantity.toString());
      
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
      
      await fetchAssets();
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

  const formatAssetId = (id) => {
    if (!id) return "N/A";
    const shortId = id.slice(-6).toUpperCase();
    return `AST-${shortId}`;
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/assets/export/${format}`, {
        responseType: 'blob',
      });
      
      const extension = format.toLowerCase();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assets.${extension}`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setExportMenuOpen(false);
    } catch (error) {
      console.error(`Error downloading assets as ${format}:`, error);
      alert(`Failed to download assets as ${format}. Please try again.`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuOpen && !event.target.closest('.export-menu-container')) {
        setExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exportMenuOpen]);

  const filteredAssets = filterStatus === "All" 
    ? assets 
    : assets.filter(asset => asset.status === filterStatus);

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl mt-20" style={{ backgroundColor: "#EAD8B1", boxShadow: "0 10px 25px rgba(0, 31, 63, 0.1)" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "#001F3F" }}>All Assets</h2>
        <div className="flex space-x-3">
          <select 
            className="border p-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ borderColor: "#6A9AB0", color: "#001F3F", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0, 31, 63, 0.1)" }}
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
          
          <div className="relative export-menu-container">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="text-white px-4 py-2 rounded-full flex items-center transition-all duration-300 ease-in-out hover:shadow-lg"
              style={{ backgroundColor: "#3A6D8C" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-10 py-2 overflow-hidden" style={{ borderColor: "#6A9AB0", borderWidth: "1px" }}>
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    CSV
                  </div>
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Excel
                  </div>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    PDF
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl shadow" style={{ borderRadius: "16px", overflow: "hidden" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-white" style={{ backgroundColor: "#3A6D8C" }}>
              <th className="p-3">Asset ID</th>
              <th className="p-3">Image</th>
              <th className="p-3">QR Code</th>
              <th className="p-3">Asset Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <tr 
                  key={asset._id} 
                  className={`text-center hover:bg-opacity-50 transition-all duration-200 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  style={{ color: "#001F3F" }}
                >
                  <td className="p-3 font-medium border-b" style={{ borderColor: "#6A9AB0" }}>
                    {formatAssetId(asset._id)}
                  </td>
                  <td className="p-3 border-b" style={{ borderColor: "#6A9AB0" }}>
                    {asset.image ? (
                      <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden shadow-sm" style={{ borderColor: "#6A9AB0", borderWidth: "1px" }}>
                        <img 
                          src={`http://localhost:5000/uploads/${asset.image}`} 
                          alt={asset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mx-auto rounded-lg" style={{ borderColor: "#6A9AB0", borderWidth: "1px" }}>
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-b" style={{ borderColor: "#6A9AB0" }}>
                    <div id={`qr-${asset._id}`} className="flex flex-col items-center">
                      <div className="p-1 bg-white rounded-lg shadow-sm">
                        <QRCodeCanvas
                          value={JSON.stringify({
                            id: asset._id,
                            name: asset.name,
                            category: asset.category,
                            status: asset.status,
                          })}
                          size={60}
                        />
                      </div>
                      <button
                        onClick={() => downloadQRCode(asset._id)}
                        className="mt-2 text-white px-2 py-1 rounded-full text-xs hover:shadow-md transition-all duration-300"
                        style={{ backgroundColor: "#6A9AB0" }}
                      >
                        Download QR
                      </button>
                    </div>
                  </td>
                  <td className="p-3 border-b" style={{ borderColor: "#6A9AB0" }}>{asset.name}</td>
                  <td className="p-3 border-b" style={{ borderColor: "#6A9AB0" }}>{asset.category}</td>
                  <td className={`p-3 border-b font-semibold ${statusColors[asset.status]}`} style={{ borderColor: "#6A9AB0" }}>
                    <span className="px-3 py-1 rounded-full text-xs" style={{ 
                      backgroundColor: asset.status === "Available" ? "#E3FCF7" : 
                                      asset.status === "Assigned" ? "#E0F2FE" : 
                                      asset.status === "Under Maintenance" ? "#FEE2E2" : 
                                      asset.status === "Returned" ? "#FEF9C3" : "#F3F4F6",
                      color: asset.status === "Available" ? "#0D9488" : 
                             asset.status === "Assigned" ? "#0369A1" : 
                             asset.status === "Under Maintenance" ? "#B91C1C" : 
                             asset.status === "Returned" ? "#A16207" : "#4B5563"
                    }}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-3 border-b" style={{ borderColor: "#6A9AB0" }}>{asset.quantity || 1}</td>
                  <td className="p-3 border-b" style={{ borderColor: "#6A9AB0" }}>{formatDate(asset.expiryDate)}</td>
                  <td className="p-3 border-b" style={{ borderColor: "#6A9AB0" }}>
                    <button
                      className="text-white px-3 py-1 rounded-full hover:shadow-md transition-all duration-300"
                      style={{ backgroundColor: "#001F3F" }}
                      onClick={() => handleEdit(asset)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-5 text-center text-gray-500 bg-white">
                  {assets.length > 0 ? "No assets match the selected filter." : "No assets found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto" style={{ borderColor: "#6A9AB0", borderWidth: "1px", backgroundColor: "#FFFCF7" }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: "#001F3F" }}>
              Edit Asset: {formatAssetId(editingAsset._id)}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Asset Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: "#6A9AB0", boxShadow: "0 2px 4px rgba(0, 31, 63, 0.05)" }}
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Category</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: "#6A9AB0", boxShadow: "0 2px 4px rgba(0, 31, 63, 0.05)" }}
                  value={editingAsset.category}
                  onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Status</label>
                <select
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: "#6A9AB0", boxShadow: "0 2px 4px rgba(0, 31, 63, 0.05)" }}
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
                <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Quantity</label>
                <input
                  type="number"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: "#6A9AB0", boxShadow: "0 2px 4px rgba(0, 31, 63, 0.05)" }}
                  value={editingAsset.quantity || 1}
                  onChange={(e) => setEditingAsset({ ...editingAsset, quantity: e.target.value })}
                  min="1"
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Expiry Date</label>
                <input
                  type="date"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: "#6A9AB0", boxShadow: "0 2px 4px rgba(0, 31, 63, 0.05)" }}
                  value={editingAsset.expiryDate ? editingAsset.expiryDate.split('T')[0] : ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, expiryDate: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Update Image</label>
                <div className="relative">
                  <input
                    type="file"
                    className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: "#6A9AB0", boxShadow: "0 2px 4px rgba(0, 31, 63, 0.05)" }}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
            
            {imagePreview && (
              <div className="mb-4">
                <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Image Preview</label>
                <div className="w-40 h-40 border rounded-xl flex items-center justify-center overflow-hidden shadow-md" style={{ borderColor: "#6A9AB0" }}>
                  <img 
                    src={imagePreview} 
                    alt="Asset preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block font-medium mb-2" style={{ color: "#3A6D8C" }}>Description</label>
              <textarea
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: "#6A9AB0", boxShadow: "0 2px 4px rgba(0, 31, 63, 0.05)" }}
                value={editingAsset.description || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className={`text-white px-5 py-2 rounded-full transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"}`}
                style={{ backgroundColor: "#3A6D8C" }}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="text-white px-5 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: "#001F3F" }}
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