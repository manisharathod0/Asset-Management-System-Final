import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const QRCodeLog = () => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const [logs] = useState([
    { id: 1, scannedData: "Laptop", date: "2024-02-15", user: "John Doe" },
    { id: 2, scannedData: "Printer", date: "2024-02-18", user: "Jane Smith" },
    { id: 3, scannedData: "Monitor", date: "2024-02-20", user: "Mark Lee" },
    { id: 4, scannedData: "Projector", date: "2024-02-21", user: "Emily Davis" },
  ]);

  // Filter logs based on search & date
  const filteredLogs = logs.filter(
    (log) =>
      log.scannedData.toLowerCase().includes(search.toLowerCase()) &&
      (filterDate === "" || log.date === filterDate)
  );

  // Handle export functionality
  const handleExport = () => {
    if (exportFormat === "csv") {
      const data = [
        ["Scanned Data", "Date", "User"],
        ...filteredLogs.map(({ scannedData, date, user }) => [scannedData, date, user]),
      ].map((e) => e.join(",")).join("\n");
      downloadFile(new Blob([data], { type: "text/csv" }), "qr_code_logs.csv");
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("QR Code Logs", 14, 10);
      autoTable(doc, {
        head: [["Scanned Data", "Date", "User"]],
        body: filteredLogs.map(({ scannedData, date, user }) => [scannedData, date, user]),
      });
      doc.save("qr_code_logs.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredLogs);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "QR Code Logs");
      XLSX.writeFile(wb, "qr_code_logs.xlsx");
    } else if (exportFormat === "docx") {
      const content = `QR Code Logs\n\n` + filteredLogs.map(({ scannedData, date, user }) => `${scannedData}\t${date}\t${user}`).join("\n");
      downloadFile(new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), "qr_code_logs.docx");
    }
  };

  // Function to download file
  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl mt-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">QR Code Logs</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search scanned data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
          <option value="docx">Word</option>
        </select>
        <button className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg" onClick={handleExport}>
          <FaDownload /> Export
        </button>
      </div>

      <motion.table 
        className="w-full border-collapse border border-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Scanned Data</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">User</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <motion.tr 
                key={log.id} 
                className="text-center bg-gray-100 hover:bg-gray-200 transition"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <td className="p-3 border">{log.scannedData}</td>
                <td className="p-3 border">{log.date}</td>
                <td className="p-3 border">{log.user}</td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">No logs found</td>
            </tr>
          )}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default QRCodeLog;
