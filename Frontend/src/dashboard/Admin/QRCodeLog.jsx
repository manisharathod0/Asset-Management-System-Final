import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const QRCodeLog = () => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null); // New error state

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
          setError("Authentication token missing. Please log in.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch logs.");
          return;
        }

        const data = await response.json();
        console.log("Fetched logs:", data);
        setLogs(data);
        setError(null); // Clear error if successful
      } catch (error) {
        console.error("Error fetching logs:", error.message);
        setError("An error occurred while fetching logs.");
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      (log.scannedData?.toLowerCase() || "").includes(search.toLowerCase()) &&
      (filterDate === "" || log.date?.startsWith(filterDate))
  );

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      alert("No logs available for export!");
      return;
    }

    if (exportFormat === "csv") {
      const data = [
        ["Scanned Data", "Date", "User"],
        ...filteredLogs.map(({ scannedData, date, user }) => [scannedData || "N/A", date || "N/A", user || "N/A"]),
      ]
        .map((e) => e.join(","))
        .join("\n");

      downloadFile(new Blob([data], { type: "text/csv" }), "qr_code_logs.csv");
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("QR Code Logs", 14, 10);
      autoTable(doc, {
        head: [["Scanned Data", "Date", "User"]],
        body: filteredLogs.map(({ scannedData, date, user }) => [scannedData || "N/A", date || "N/A", user || "N/A"]),
      });
      doc.save("qr_code_logs.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredLogs.map((log) => ({
        "Scanned Data": log.scannedData || "N/A",
        Date: log.date || "N/A",
        User: log.user || "N/A",
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "QR Code Logs");
      XLSX.writeFile(wb, "qr_code_logs.xlsx");
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div className="p-6 bg-white shadow-lg rounded-xl mt-20" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">QR Code Logs</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="p-3 border rounded-lg">
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
        <button className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg" onClick={handleExport}>
          <FaDownload /> Export
        </button>
      </div>

      <motion.table className="w-full border-collapse border border-gray-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
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
      <motion.tr key={log._id} className="text-center bg-gray-100 hover:bg-gray-200 transition" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <td className="p-3 border">{log.assetId?.name || "N/A"}</td>
        <td className="p-3 border">{log.scanDate ? new Date(log.scanDate).toLocaleString() : "N/A"}</td>
        <td className="p-3 border">{log.userId?.name || "N/A"} ({log.userId?.role || "N/A"})</td>
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
