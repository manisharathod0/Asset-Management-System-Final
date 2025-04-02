import { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const ScanQR = ({ onScanSuccess, onScanError }) => {
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const qrCodeScanner = new Html5Qrcode("reader");
        const decodedText = await qrCodeScanner.scanFile(file, false);
  
        console.log("📜 Raw Scanned Data:", decodedText); // ✅ Debug raw QR data
  
        const parsedData = parseScannedData(decodedText);
        console.log("✅ Parsed Scanned Data:", parsedData); // ✅ Check if ID exists
  
        if (!parsedData || !parsedData.id) {
          throw new Error("Scanned data is invalid or missing ID!");
        }
  
        setScanResult(formatScannedData(parsedData));
        sendScannedDataToBackend(parsedData);
        
        if (onScanSuccess) onScanSuccess(parsedData);
      } catch (error) {
        setErrorMessage("QR code not detected. Try another image.");
        if (onScanError) onScanError(error);
      }
    };
  
    reader.readAsDataURL(file);
  };
  const parseScannedData = (text) => {
    try {
      if (text.startsWith("{") && text.endsWith("}")) {
        return JSON.parse(text); // If QR contains JSON, parse it
      }
  
      // 🔍 Try extracting data manually if not JSON
      const idMatch = text.match(/ID:\s*([a-f0-9]{24})/i);
      const nameMatch = text.match(/Name:\s*(.+)/i);
      const categoryMatch = text.match(/Category:\s*(.+)/i);
      const assignedMatch = text.match(/Assigned To:\s*(.+)/i);
      const statusMatch = text.match(/Status:\s*(.+)/i);
  
      if (!idMatch) return null; // ID is mandatory
  
      return {
        id: idMatch[1],
        name: nameMatch ? nameMatch[1] : "Unknown",
        category: categoryMatch ? categoryMatch[1] : "Unknown",
        assignedTo: assignedMatch ? assignedMatch[1] : "Not Assigned",
        status: statusMatch ? statusMatch[1] : "Unknown",
      };
    } catch (error) {
      console.error("Error parsing scanned data:", error);
      return null;
    }
  };


  // Function to send scanned data to the backend
  const sendScannedDataToBackend = async (scannedData) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) throw new Error("User not logged in. No authentication token found!");
  
      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;
      if (!token) throw new Error("No authentication token found!");
  
      const response = await fetch("http://localhost:5000/api/scanned-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 Add JWT token here
        },
        body: JSON.stringify({ assetId: scannedData.id }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to save scanned data");
      }
  
      console.log("✅ Scan saved:", data.message);
      alert("Scan saved successfully!"); 
  
    } catch (error) {
      console.error("❌ Error saving scanned data:", error.message);
      alert("Error saving scanned data: " + error.message);
    }
  };  
  const formatScannedData = (data) => {
    return `📌 Asset Details
  --------------------------------
  🆔 ID: ${data.id}
  🏷 Name: ${data.name}
  📂 Category: ${data.category}
  👤 Assigned To: ${data.assignedTo}
  🚦 Status: ${data.status}`;
  };
  
  
  // Reset state for scanning another QR code
  const handleScanAnother = () => {
    setScanResult(null);
    setErrorMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Scan QR Code
        </h2>

        {!scanResult ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer bg-white text-gray-700 text-center"
            />
            <div id="reader" className="hidden"></div>
            {errorMessage && (
              <p className="mt-4 text-red-500 font-medium text-center">
                {errorMessage}
              </p>
            )}
          </>
        ) : (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-left">
            <pre className="text-lg font-medium break-words whitespace-pre-wrap">
              {scanResult}
            </pre>
            <button
              onClick={handleScanAnother}
              className="mt-4 px-4 ml-20 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Scan Another QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;