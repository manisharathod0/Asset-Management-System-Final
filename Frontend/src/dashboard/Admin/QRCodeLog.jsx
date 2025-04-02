import { useState, useEffect } from "react";
import { 
  FaDownload, 
  FaSearch, 
  FaCalendarAlt, 
  FaTable, 
  FaQrcode, 
  FaUser, 
  FaExclamationTriangle,
  FaSyncAlt,
  FaFilter
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const QRCodeLog = () => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  // Color palette
  const colors = {
    darkNavy: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    sand: "#EAD8B1"
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
          setError("Authentication token missing. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch logs.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setLogs(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching logs:", error.message);
        setError("An error occurred while fetching logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      (log.scannedData?.toLowerCase() || "").includes(search.toLowerCase()) &&
      (filterDate === "" || log.date?.startsWith(filterDate))
  );

  const handleExport = (format) => {
    if (filteredLogs.length === 0) {
      alert("No logs available for export!");
      return;
    }

    if (format === "csv") {
      const data = [
        ["Scanned Data", "Date", "User"],
        ...filteredLogs.map(({ scannedData, date, user }) => [scannedData || "N/A", date || "N/A", user || "N/A"]),
      ]
        .map((e) => e.join(","))
        .join("\n");

      downloadFile(new Blob([data], { type: "text/csv" }), "qr_code_logs.csv");
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.text("QR Code Logs", 14, 10);
      autoTable(doc, {
        head: [["Scanned Data", "Date", "User"]],
        body: filteredLogs.map(({ scannedData, date, user }) => [scannedData || "N/A", date || "N/A", user || "N/A"]),
        theme: 'grid',
        styles: { fillColor: [58, 109, 140] },
        headStyles: { fillColor: [0, 31, 63] }
      });
      doc.save("qr_code_logs.pdf");
    } else if (format === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredLogs.map((log) => ({
        "Scanned Data": log.scannedData || "N/A",
        Date: log.date || "N/A",
        User: log.user || "N/A",
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "QR Code Logs");
      XLSX.writeFile(wb, "qr_code_logs.xlsx");
    }
    
    setShowExportOptions(false);
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <motion.div 
        className="p-8 mt-20 bg-white shadow-lg rounded-xl flex flex-col items-center justify-center min-h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 border-4 border-t-4 rounded-full animate-spin" 
          style={{ borderColor: colors.lightBlue, borderTopColor: colors.darkNavy }}></div>
        <p className="mt-4 text-lg font-medium" style={{ color: colors.mediumBlue }}>Loading QR Code Logs...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="p-8 mt-20 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ boxShadow: `0 10px 25px -5px rgba(0, 31, 63, 0.1)` }}
    >
      <div className="flex items-center justify-center mb-6">
        <FaQrcode className="text-4xl mr-3" style={{ color: colors.darkNavy }} />
        <h2 className="text-3xl font-bold text-gray-800">QR Code Logs</h2>
      </div>

      {error && (
        <motion.div 
          className="mb-6 p-4 rounded-lg flex items-center" 
          style={{ backgroundColor: `rgba(234, 216, 177, 0.3)`, border: `1px solid ${colors.sand}` }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="text-xl mr-2" style={{ color: colors.darkNavy }} />
          <p style={{ color: colors.darkNavy }}>{error}</p>
          <button 
            className="ml-auto py-1 px-3 rounded-lg flex items-center text-sm" 
            style={{ backgroundColor: colors.mediumBlue, color: 'white' }}
            onClick={() => window.location.reload()}
          >
            <FaSyncAlt className="mr-1" /> Retry
          </button>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search scanned data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 pl-10 w-full border rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{ 
              borderColor: colors.lightBlue, 
              focusRing: colors.mediumBlue,
            }}
          />
        </div>
        
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{ 
              borderColor: colors.lightBlue,
              focusRing: colors.mediumBlue,
            }}
          />
        </div>
        
        <div className="relative">
          <button 
            className="px-5 py-3 rounded-lg flex items-center gap-2 text-white hover:shadow-lg transition-all w-full justify-center md:w-auto"
            style={{ backgroundColor: colors.darkNavy }}
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            <FaDownload /> Export
          </button>
          
          <AnimatePresence>
            {showExportOptions && (
              <motion.div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 overflow-hidden border"
                style={{ borderColor: colors.lightBlue }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => handleExport("csv")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                  style={{ color: colors.darkNavy }}
                >
                  <FaTable className="text-green-600" />
                  <span>CSV</span>
                </button>
                <button 
                  onClick={() => handleExport("pdf")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                  style={{ color: colors.darkNavy }}
                >
                  <FaTable className="text-red-600" />
                  <span>PDF</span>
                </button>
                <button 
                  onClick={() => handleExport("excel")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                  style={{ color: colors.darkNavy }}
                >
                  <FaTable className="text-blue-600" />
                  <span>Excel</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ borderColor: colors.lightBlue }}>
        <motion.table 
          className="w-full border-collapse" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          <thead>
            <tr style={{ backgroundColor: colors.darkNavy, color: 'white' }}>
              <th className="p-4 text-left font-semibold">Scanned Data</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">User</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <motion.tr 
                  key={log._id} 
                  className="hover:bg-gray-100 transition-colors"
                  style={{ backgroundColor: index % 2 === 0 ? 'white' : `rgba(106, 154, 176, 0.1)` }}
                  initial={{ x: -10, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="p-4 border-t" style={{ borderColor: `rgba(106, 154, 176, 0.2)` }}>
                    <div className="flex items-center">
                      <FaQrcode className="mr-2" style={{ color: colors.mediumBlue }} />
                      {log.assetId?.name || "N/A"}
                    </div>
                  </td>
                  <td className="p-4 border-t" style={{ borderColor: `rgba(106, 154, 176, 0.2)` }}>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" style={{ color: colors.mediumBlue }} />
                      {log.scanDate ? formatDate(log.scanDate) : "N/A"}
                    </div>
                  </td>
                  <td className="p-4 border-t" style={{ borderColor: `rgba(106, 154, 176, 0.2)` }}>
                    <div className="flex items-center">
                      <FaUser className="mr-2" style={{ color: colors.mediumBlue }} />
                      <span>{log.userId?.name || "N/A"}</span>
                      {log.userId?.role && (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full" 
                          style={{ backgroundColor: colors.sand, color: colors.darkNavy }}>
                          {log.userId.role}
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-8 text-center">
                  <div className="flex flex-col items-center">
                    <FaFilter className="text-4xl mb-3" style={{ color: `rgba(58, 109, 140, 0.3)` }} />
                    <p className="text-gray-500">No logs found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>
      
      <div className="mt-4 text-center text-sm" style={{ color: colors.mediumBlue }}>
        Showing {filteredLogs.length} of {logs.length} total logs
      </div>
    </motion.div>
  );
};

export default QRCodeLog;