


import { useState } from "react";
import axios from "axios";

const AddNewAsset = () => {
  const [asset, setAsset] = useState({
    name: "",
    category: "",
    status: "Available",
    description: "",
    expiryDate: "",
    quantity: 1,
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setAsset({ ...asset, image: file });
        
        // Create a preview URL for the image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setAsset({ ...asset, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", asset.name);
      formData.append("category", asset.category);
      formData.append("status", asset.status);
      formData.append("description", asset.description);
      formData.append("expiryDate", asset.expiryDate);
      formData.append("quantity", asset.quantity.toString()); // Ensure quantity is a string
      
      if (asset.image) {
        formData.append("image", asset.image);
      }
      
      const response = await axios.post("http://localhost:5000/api/assets", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      alert("Asset added successfully!");
      
      // Reset form
      setAsset({
        name: "",
        category: "",
        status: "Available",
        description: "",
        expiryDate: "",
        quantity: 1,
        image: null
      });
      setImagePreview(null);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("An asset with this name already exists. Please use a different name.");
      } else {
        console.error("Error adding asset:", error);
        alert("Failed to add asset. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mt-20">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Asset Name</label>
            <input
              type="text"
              name="name"
              value={asset.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={asset.category}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          
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
        
        <button 
          type="submit" 
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Asset..." : "Add Asset"}
        </button>
      </form>
    </div>
  );
};

export default AddNewAsset;



