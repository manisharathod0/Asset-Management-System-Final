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

      const response = await axios.post("http://localhost:5000/api/assets", formData, {
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
    <div className="p-6 bg-white shadow-lg rounded-xl mt-20">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Asset</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Asset Name</label>
            <input type="text" name="name" value={asset.name} onChange={handleChange} className="border p-2 w-full rounded" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input type="text" name="category" value={asset.category} onChange={handleChange} className="border p-2 w-full rounded" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              name="status"
              value={asset.status}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={asset.quantity}
              onChange={handleChange}
              min="1"
              className="border p-2 w-full rounded"
              required
            />
          </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={asset.expiryDate}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="border p-2 w-full rounded"
            />
            <small className="text-gray-500">Max size: 5MB. Formats: JPEG, PNG, GIF, WEBP</small>
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
            name="description"
            value={asset.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"}`} disabled={isSubmitting}>
          {isSubmitting ? "Adding Asset..." : "Add Asset"}
        </button>
      </form>

      {/* QR Code Display (Only Show if Asset is Added) */}
      {qrValue && (
        <div className="mt-6 p-4 bg-gray-100 border rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Asset QR Code</h3>
          <QRCodeCanvas id="qrCanvas" value={qrValue} size={200} />
          <button onClick={handleDownloadQR} className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
            <span>Download QR</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddNewAsset;
