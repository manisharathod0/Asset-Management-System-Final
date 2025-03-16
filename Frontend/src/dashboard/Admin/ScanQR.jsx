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
        const formattedText = formatWithNewLines(decodedText);

        setScanResult(formattedText);
        setErrorMessage("");

        if (onScanSuccess) onScanSuccess(decodedText);
      } catch (error) {
        setErrorMessage("QR code not detected. Try another image.");
        if (onScanError) onScanError(error);
      }
    };

    reader.readAsDataURL(file);
  };

  // Function to format text: insert a newline before emojis
  const formatWithNewLines = (text) => {
    return text.replace(/([^\s])([\u{1F300}-\u{1FAD6}])/gu, "$1\n$2");
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
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            <pre className="text-lg font-medium break-words whitespace-pre-wrap">
              {scanResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;
