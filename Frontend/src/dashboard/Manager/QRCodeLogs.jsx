import { useState } from "react";

const QRCodeLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      assetName: "Laptop",
      scannedBy: "John Doe",
      department: "IT",
      scanDate: "2025-03-04",
      location: "Head Office",
    },
    {
      id: 2,
      assetName: "Projector",
      scannedBy: "Jane Smith",
      department: "HR",
      scanDate: "2025-03-03",
      location: "Conference Room",
    },
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-6">
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          QR Code Logs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-[#3A6D8C] text-white text-left">
                <th className="py-3 px-5">Asset Name</th>
                <th className="py-3 px-5">Scanned By</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Scan Date</th>
                <th className="py-3 px-5">Location</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-100 transition duration-200">
                  <td className="py-3 px-5">{log.assetName}</td>
                  <td className="py-3 px-5">{log.scannedBy}</td>
                  <td className="py-3 px-5">{log.department}</td>
                  <td className="py-3 px-5">{log.scanDate}</td>
                  <td className="py-3 px-5">{log.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QRCodeLogs;
