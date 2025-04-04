import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import QR Code
import axios from "axios";

const AddNewAsset = () => {
  const [asset, setAsset] = useState({
    name: "",
    category: "",
    status: "Available",
    description: "",
    expiryDate: "",
    quantity: 1,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [qrValue, setQrValue] = useState(""); // QR Code Value
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Image file size must be less than 5MB");
          return;
        }

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
          setError("Only image files (JPEG, PNG, GIF, WEBP) are allowed");
          return;
        }

        setAsset({ ...asset, image: file });

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setError(null);
      }
    } else if (type === "number") {
      const numValue = parseInt(value, 10);
      setAsset({ 
        ...asset, 
        [name]: numValue < 1 ? 1 : numValue 
      });
    } else {
      setAsset({ ...asset, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!asset.name.trim()) {
      setError("Asset name is required");
      setIsSubmitting(false);
      return;
    }

    if (!asset.category.trim()) {
      setError("Category is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", asset.name.trim());
      formData.append("category", asset.category.trim());
      formData.append("status", asset.status);
      formData.append("description", asset.description);
      if (asset.expiryDate) {
        formData.append("expiryDate", asset.expiryDate);
      }
      formData.append("quantity", asset.quantity.toString());
      if (asset.image) {
        formData.append("image", asset.image);
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/assets`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess("Asset added successfully!");

      // ✅ Generate QR Code for the new asset
      const newAsset = response.data; // Assuming API returns the added asset details
      const qrData = `📌 Asset Details\n` +
        `--------------------------------\n` +
        `🆔 ID: ${newAsset._id || "N/A"}\n` +
        `🏷 Name: ${newAsset.name || "N/A"}\n` +
        `📂 Category: ${newAsset.category || "N/A"}\n` +
        `👤 Assigned To: ${newAsset.assignedTo || "Not Assigned"}\n` +
        `⚙️ Condition: ${newAsset.condition || "Unknown"}\n` +
        `🚦 Status: ${newAsset.status || "N/A"}`;
      setQrValue(qrData);

      // Reset form
      setAsset({
        name: "",
        category: "",
        status: "Available",
        description: "",
        expiryDate: "",
        quantity: 1,
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error details:", error);

      if (error.response) {
        console.error("Server error:", error.response.data);

        if (error.response.status === 409) {
          setError("An asset with this name already exists. Please use a different name.");
        } else if (error.response.status === 400) {
          const errorMsg = error.response.data.errors 
            ? Object.values(error.response.data.errors).map(e => e.message).join('\n')
            : error.response.data.message;
          setError(`Validation error: ${errorMsg}`);
        } else {
          const errorMessage = error.response.data.error || error.response.data.message || 'Failed to add asset. Please try again.';
          setError(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please check your connection and try again.");
      } else {
        console.error("Request setup error:", error.message);
        setError(`Request error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Function to download QR code as an image
  const handleDownloadQR = () => {
    const qrCanvas = document.getElementById("qrCanvas");
    if (qrCanvas) {
      const qrImage = qrCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = qrImage;
      a.download = "asset_qr_code.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-[#EAD8B1]/10 shadow-lg rounded-xl mt-20 border border-[#6A9AB0]/20">
      <h2 className="text-2xl font-semibold mb-4 text-[#001F3F] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-[#3A6D8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Asset
      </h2>

      {error && 
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      }
      
      {success && 
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-200 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      }

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-5 rounded-lg shadow-sm border border-[#EAD8B1]/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-[#3A6D8C] font-medium mb-2">Asset Name</label>
            <input 
              type="text" 
              name="name" 
              value={asset.name} 
              onChange={handleChange} 
              className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#3A6D8C] font-medium mb-2">Category</label>
            <input 
              type="text" 
              name="category" 
              value={asset.category} 
              onChange={handleChange} 
              className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-[#3A6D8C] font-medium mb-2">Status</label>
            <select
              name="status"
              value={asset.status}
              onChange={handleChange}
              className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-[#3A6D8C] font-medium mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={asset.quantity}
              onChange={handleChange}
              min="1"
              className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
              required
            />
          </div>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-[#3A6D8C] font-medium mb-2">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={asset.expiryDate}
              onChange={handleChange}
              className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-[#3A6D8C] font-medium mb-2">Upload Image</label>
            <div className="border border-dashed border-[#6A9AB0] rounded-md p-3 bg-[#EAD8B1]/5">
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full text-[#3A6D8C]"
              />
              <small className="text-[#6A9AB0] mt-1 block">Max size: 5MB. Formats: JPEG, PNG, GIF, WEBP</small>
            </div>
          </div>
        </div>
        
        {imagePreview && (
          <div className="mb-4">
            <label className="block text-[#3A6D8C] font-medium mb-2">Image Preview</label>
            <div className="w-40 h-40 border border-[#EAD8B1] rounded-md flex items-center justify-center overflow-hidden shadow-sm">
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
            name="description"
            value={asset.description}
            onChange={handleChange}
            className="border border-[#6A9AB0]/30 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
            rows="4"
            placeholder="Enter details about this asset..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          className={`bg-gradient-to-r from-[#3A6D8C] to-[#001F3F] text-white px-5 py-2.5 rounded-md shadow-sm flex items-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:from-[#001F3F] hover:to-[#001F3F] transition-all duration-300"}`} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Asset...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Asset
            </>
          )}
        </button>
      </form>

      {/* QR Code Display (Only Show if Asset is Added) */}
      {qrValue && (
        <div className="mt-6 p-5 bg-gradient-to-r from-[#001F3F]/5 to-[#EAD8B1]/10 border border-[#6A9AB0]/30 rounded-lg flex flex-col items-center shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-[#001F3F] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#3A6D8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Asset QR Code
          </h3>
          <div className="bg-white p-3 rounded-md shadow-sm border border-[#EAD8B1]">
            <QRCodeCanvas 
              id="qrCanvas" 
              value={qrValue} 
              size={200} 
              bgColor={"#FFFFFF"}
              fgColor={"#001F3F"}
              level={"H"}
              includeMargin={true}
            />
          </div>
          <button 
            onClick={handleDownloadQR} 
            className="mt-4 bg-[#3A6D8C] hover:bg-[#001F3F] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download QR Code</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddNewAsset;