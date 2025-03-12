import { useState } from "react";
import { motion } from "framer-motion";
import { FaQrcode } from "react-icons/fa";

const ScanQRCode = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanResult({
        assetName: "Dell Laptop",
        assetId: "ASSET-12345",
        status: "Assigned",
      });
      setScanning(false);
    }, 2000);
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-2xl mx-auto flex flex-col items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Scan QR Code</h2>
      <div className="w-full flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300">
        <button
          className="bg-[#3A6D8C] text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:bg-[#2c526a] transition"
          onClick={handleScan}
          disabled={scanning}
        >
          <FaQrcode size={24} /> {scanning ? "Scanning..." : "Scan QR Code"}
        </button>
      </div>
      {scanResult && (
        <motion.div 
          className="mt-6 bg-white p-6 rounded-lg shadow-md border w-full text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800">Asset Details</h3>
          <p className="text-lg text-gray-700 mt-2"><span className="font-bold">Asset:</span> {scanResult.assetName}</p>
          <p className="text-lg text-gray-700"><span className="font-bold">ID:</span> {scanResult.assetId}</p>
          <p className="text-lg font-bold text-blue-600 mt-2">Status: {scanResult.status}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ScanQRCode;