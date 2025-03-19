import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaDownload } from "react-icons/fa";
import axios from "axios";

const GenerateQR = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [qrValue, setQrValue] = useState("");

  // Fetch assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/assets");
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  // Generate QR Code
  const handleGenerateQR = () => {
    if (selectedAsset) {
      // Safely format asset details
      const assetDetails = 
        `📌 Asset Details\n` +
        `--------------------------------\n` +
        `🆔 ID: ${selectedAsset._id || "N/A"}\n` +
        `🏷 Name: ${selectedAsset.name || "N/A"}\n` +
        `📂 Category: ${selectedAsset.category || "N/A"}\n` +
        `🔢 Serial No: ${selectedAsset.serialNumber || "N/A"}\n` +
        `👤 Assigned To: ${selectedAsset.assignedTo || "Not Assigned"}\n` +
        `⚙️ Condition: ${selectedAsset.condition || "Unknown"}\n` +
        `🚦 Status: ${selectedAsset.status || "N/A"}`;
  
      setQrValue(assetDetails);
    } else if (customInput.trim() !== "") {
      const customData = `📌 Custom Asset Entry\n---------------------\n🔹 ${customInput}`;
      setQrValue(customData);
    }
  };
  

  // Download QR Code
  const handleDownloadQR = () => {
    const canvas = document.getElementById("qrCanvas");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 mt-20 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Generate QR Code
      </h2>

      {/* Selector & Input Field */}
      <div className="flex flex-col items-center">
        <select
          value={selectedAsset ? selectedAsset._id : ""}
          onChange={(e) => {
            const asset = assets.find((a) => a._id === e.target.value);
            setSelectedAsset(asset || null);
          }}
          className="p-3 w-full max-w-md border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="">Select an Asset</option>
          {assets.map((asset) => (
            <option key={asset._id} value={asset._id}>
              {asset.name} - {asset.serialNumber}
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerateQR}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Generate QR Code
        </button>
      </div>

      {/* QR Code Display */}
      {qrValue && (
        <div className="mt-4 flex flex-col items-center">
          <QRCodeCanvas id="qrCanvas" value={qrValue} size={200} />
          <button
            onClick={handleDownloadQR}
            className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FaDownload /> Download QR
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateQR;
