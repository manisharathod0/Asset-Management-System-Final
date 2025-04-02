import { useEffect, useState} from "react";
import axios from "axios";
import { QRCodeCanvas  } from "qrcode.react";

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
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

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
    // Find the QR code canvas for the specific asset
    const qrCodeContainer = document.getElementById(`qr-${assetId}`);
    
    if (!qrCodeContainer) {
      console.error("QR Code container not found!");
      return;
    }
  
    // Find the canvas within the container
    const qrCanvas = qrCodeContainer.querySelector('canvas');
    
    if (!qrCanvas) {
      console.error("QR Code canvas not found!");
      return;
    }
  
    try {
      // Convert canvas to data URL
      const url = qrCanvas.toDataURL("image/png");
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${assetId}.png`;
      
      // Append to body, click, and remove
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

  // Format the MongoDB ID to be more user-friendly
  const formatAssetId = (id) => {
    if (!id) return "N/A";
    // Take the last 6 characters of the ID and uppercase them
    const shortId = id.slice(-6).toUpperCase();
    return `AST-${shortId}`;
  };

  const handleExport = async (format) => {
    try {
      // Using axios to get the file in the specified format
      const response = await axios.get(`http://localhost:5000/api/assets/export/${format}`, {
        responseType: 'blob', // Important for handling file downloads
      });
      
      // Determine file extension based on format
      const extension = format.toLowerCase();
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assets.${extension}`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Close the export menu
      setExportMenuOpen(false);
    } catch (error) {
      console.error(`Error downloading assets as ${format}:`, error);
      alert(`Failed to download assets as ${format}. Please try again.`);
    }
  };

  // Close export menu when clicking outside
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

  // Filter assets based on selected status
  const filteredAssets = filterStatus === "All" 
    ? assets 
    : assets.filter(asset => asset.status === filterStatus);

  return (
    <div className="p-6 bg-gradient-to-b from-white to-[#EAD8B1]/10 shadow-lg rounded-xl mt-20 border border-[#6A9AB0]/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#001F3F] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-[#3A6D8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          All Assets
        </h2>
        <div className="flex space-x-3">
          <select 
            className="border border-[#6A9AB0] p-2 rounded-md bg-white shadow-sm text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]"
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
          
          {/* Export dropdown button */}
          <div className="relative export-menu-container">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="bg-[#3A6D8C] hover:bg-[#001F3F] text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-[#EAD8B1]">
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 text-[#001F3F] hover:bg-[#EAD8B1]/20"
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
                  className="block w-full text-left px-4 py-2 text-[#001F3F] hover:bg-[#EAD8B1]/20"
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
                  className="block w-full text-left px-4 py-2 text-[#001F3F] hover:bg-[#EAD8B1]/20"
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
      
      <div className="overflow-x-auto rounded-lg border border-[#6A9AB0]/30 shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#001F3F] to-[#3A6D8C] text-white">
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Asset ID</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Image</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">QR Code</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Asset Name</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Category</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Status</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Quantity</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Expiry Date</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <tr key={asset._id} className={`text-center hover:bg-[#EAD8B1]/10 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-[#6A9AB0]/5'}`}>
                  <td className="p-3 border-b border-[#6A9AB0]/10 font-medium text-[#001F3F]">
                    {formatAssetId(asset._id)}
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10">
                    {asset.image ? (
                      <div className="w-16 h-16 mx-auto rounded-md overflow-hidden shadow-sm border border-[#EAD8B1]/50">
                        <img 
                          src={`http://localhost:5000/uploads/${asset.image}`} 
                          alt={asset.name}
                          className="w-full h-full object-contain bg-white"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-[#EAD8B1]/20 flex items-center justify-center mx-auto rounded-md border border-[#EAD8B1]/50">
                        <span className="text-xs text-[#3A6D8C]">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10">
                    <div id={`qr-${asset._id}`} className="flex flex-col items-center">
                      <div className="p-2 bg-white rounded-md shadow-sm border border-[#EAD8B1]/50">
                        <QRCodeCanvas
                          value={JSON.stringify({
                            id: asset._id,
                            name: asset.name,
                            category: asset.category,
                            status: asset.status,
                          })}
                          size={60}
                          bgColor={"#FFFFFF"}
                          fgColor={"#001F3F"}
                          level={"H"}
                          includeMargin={true}
                        />
                      </div>
                      <button
                        onClick={() => downloadQRCode(asset._id)}
                        className="mt-2 bg-[#6A9AB0] hover:bg-[#3A6D8C] text-white px-2 py-1 rounded text-xs transition-colors duration-200 shadow-sm"
                      >
                        Download QR
                      </button>
                    </div>
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 font-medium text-[#3A6D8C]">{asset.name}</td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 text-[#001F3F]">{asset.category}</td>
                  <td className={`p-3 border-b border-[#6A9AB0]/10 font-semibold ${statusColors[asset.status]}`}>
                    <span className="px-2 py-1 rounded-full text-xs inline-block" style={{
                      backgroundColor: asset.status === 'Available' ? '#dcfce7' : 
                                      asset.status === 'Assigned' ? '#dbeafe' : 
                                      asset.status === 'Under Maintenance' ? '#fee2e2' : 
                                      asset.status === 'Returned' ? '#fef9c3' : '#f3f4f6'
                    }}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 text-[#001F3F]">{asset.quantity || 1}</td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 text-[#001F3F]">{formatDate(asset.expiryDate)}</td>
                  <td className="p-3 border-b border-[#6A9AB0]/10">
                    <button
                      className="bg-[#3A6D8C] hover:bg-[#001F3F] text-white px-3 py-1.5 rounded-md transition-colors duration-200 shadow-sm text-sm"
                      onClick={() => handleEdit(asset)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-[#3A6D8C] italic">
                  {assets.length > 0 ? "No assets match the selected filter." : "No assets found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#001F3F]/60 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-[#001F3F] border-b border-[#EAD8B1] pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#3A6D8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Asset: {formatAssetId(editingAsset._id)}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-[#3A6D8C] font-medium mb-2">Asset Name</label>
                <input
                  type="text"
                  className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-[#3A6D8C] font-medium mb-2">Category</label>
                <input
                  type="text"
                  className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
                  value={editingAsset.category}
                  onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-[#3A6D8C] font-medium mb-2">Status</label>
                <select
                  className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
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
                <label className="block text-[#3A6D8C] font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
                  value={editingAsset.quantity || 1}
                  onChange={(e) => setEditingAsset({ ...editingAsset, quantity: e.target.value })}
                  min="1"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-[#3A6D8C] font-medium mb-2">Expiry Date</label>
                <input
                  type="date"
                  className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
                  value={editingAsset.expiryDate ? editingAsset.expiryDate.split('T')[0] : ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, expiryDate: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-[#3A6D8C] font-medium mb-2">Update Image</label>
                <input
                  type="file"
                  className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
            
            {imagePreview && (
              <div className="mb-4">
                <label className="block text-[#3A6D8C] font-medium mb-2">Image Preview</label>
                <div className="w-40 h-40 border border-[#EAD8B1] rounded-md flex items-center justify-center overflow-hidden shadow-sm bg-white">
                  <img 
                    src={imagePreview} 
                    alt="Asset preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-[#3A6D8C] font-medium mb-2">Description</label>
              <textarea
                className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
                value={editingAsset.description || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end mt-6 border-t border-[#EAD8B1] pt-4">
              <button
                className={`bg-[#3A6D8C] text-white px-4 py-2 rounded-md mr-3 shadow-sm transition-colors duration-200 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#001F3F]"}`}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-[#001F3F] px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
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