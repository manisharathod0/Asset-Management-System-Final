import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaDownload, FaFilter, FaFileExport } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AssetHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/assets/history`);
      setHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Updated filtering logic: compare action in a case-insensitive manner
  const filteredHistory = history
    .filter((entry) => {
      // Check asset name match
      const assetNameMatch =
        entry.asset && entry.asset.name
          ? entry.asset.name.toLowerCase().includes(search.toLowerCase())
          : search === "";
      
      // Filter by action type (case-insensitive)
      const actionMatch =
        filter === "All" ||
        (entry.action && entry.action.toLowerCase() === filter.toLowerCase());

      return assetNameMatch && actionMatch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleExport = () => {
    if (filteredHistory.length === 0) {
      alert("No data available to export!");
      return;
    }

    if (exportFormat === "csv") {
      const data = [
        [
          "Asset",
          "Action",
          "Status",
          "Date",
          "User",
          "Quantity",
          "Expiry Date",
          "Image Updated"
        ],
        ...filteredHistory.map(
          ({ asset, action, date, user, quantityChange, expiryDateChange, imageChange }) => [
            asset?.name || "N/A",
            action || "N/A",
            asset?.status || "N/A",
            date ? new Date(date).toLocaleDateString() : "N/A",
            user || "N/A",
            quantityChange ? asset?.quantity || "N/A" : "N/A",
            expiryDateChange ? (asset?.expiryDate ? formatDate(asset.expiryDate) : "N/A") : "N/A",
            imageChange ? "Yes" : "No"
          ]
        )
      ]
        .map((e) => e.join(","))
        .join("\n");
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "asset_history.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("Asset History", 14, 10);
      autoTable(doc, {
        head: [
          ["Asset", "Action", "Status", "Date", "User", "Quantity", "Expiry Date", "Image Updated"]
        ],
        body: filteredHistory.map(
          ({ asset, action, date, user, quantityChange, expiryDateChange, imageChange }) => [
            asset?.name || "N/A",
            action || "N/A",
            asset?.status || "N/A",
            date ? new Date(date).toLocaleDateString() : "N/A",
            user || "N/A",
            quantityChange ? asset?.quantity || "N/A" : "N/A",
            expiryDateChange ? (asset?.expiryDate ? formatDate(asset.expiryDate) : "N/A") : "N/A",
            imageChange ? "Yes" : "No"
          ]
        ),
      });
      doc.save("asset_history.pdf");
    } else if (exportFormat === "excel") {
      const data = filteredHistory.map(
        ({ asset, action, date, user, quantityChange, expiryDateChange, imageChange }) => ({
          Asset: asset?.name || "N/A",
          Action: action || "N/A",
          Status: asset?.status || "N/A",
          Date: date ? new Date(date).toLocaleDateString() : "N/A",
          User: user || "N/A",
          Quantity: quantityChange ? asset?.quantity || "N/A" : "N/A",
          "Expiry Date": expiryDateChange ? (asset?.expiryDate ? formatDate(asset.expiryDate) : "N/A") : "N/A",
          "Image Updated": imageChange ? "Yes" : "No",
        })
      );
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asset History");
      XLSX.writeFile(wb, "asset_history.xlsx");
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Created":
        return "#4ade80"; // green
      case "Updated":
        return "#f97316"; // orange
      case "Deleted":
        return "#ef4444"; // red
      case "Assigned":
        return "#3b82f6"; // blue
      case "Returned":
        return "#6366f1"; // indigo
      case "Under Maintenance":
        return "#a855f7"; // purple
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-b from-white to-[#EAD8B1]/10 shadow-lg rounded-xl max-w-6xl mx-auto mt-20 border border-[#6A9AB0]/20"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-[#001F3F] text-center flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-[#3A6D8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Asset History
      </h2>
      
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-[#6A9AB0]" />
          </div>
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 p-3 w-full border border-[#6A9AB0]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent"
          />
        </div>
        
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-[#6A9AB0]" />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="pl-10 p-3 border border-[#6A9AB0]/30 rounded-lg text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent bg-white"
          >
            <option value="All">All Actions</option>
            <option value="Created">Created</option>
            <option value="Updated">Updated</option>
            <option value="Deleted">Deleted</option>
            <option value="Assigned">Assigned</option>
            <option value="Returned">Returned</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFileExport className="text-[#6A9AB0]" />
            </div>
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)} 
              className="pl-10 p-3 border border-[#6A9AB0]/30 rounded-lg text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:border-transparent bg-white"
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          
          <button 
            className="bg-gradient-to-r from-[#3A6D8C] to-[#001F3F] text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:from-[#001F3F] hover:to-[#001F3F] transition-all duration-300 shadow-sm" 
            onClick={handleExport}
          >
            <FaDownload /> Export
          </button>
        </div>
      </div>
      
      {/* Debug info */}
      {history.length > 0 && (
        <div className="mb-4 flex justify-between text-sm text-[#3A6D8C]">
          <div>Total records: {history.length}</div>
          <div>Filtered records: {filteredHistory.length}</div>
          <div>Filter: {filter}</div>
        </div>
      )}
      
      <motion.div 
        className="overflow-x-auto rounded-lg border border-[#6A9AB0]/30 shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#001F3F] to-[#3A6D8C] text-white">
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium text-left">Asset</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Image</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Action</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Status</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Quantity</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Expiry Date</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">Date</th>
              <th className="p-3 border-b border-[#6A9AB0]/20 font-medium">User</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((entry, index) => (
                <motion.tr 
                  key={entry._id || index} 
                  className={`text-center hover:bg-[#EAD8B1]/10 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-[#6A9AB0]/5'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 1), duration: 0.3 }}
                >
                  <td className="p-3 border-b border-[#6A9AB0]/10 font-medium text-[#001F3F] text-left">
                    {entry.asset?.name || "N/A"}
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10">
                    {entry.asset?.image ? (
                      <div className="w-14 h-14 mx-auto rounded-md overflow-hidden shadow-sm border border-[#EAD8B1]/50">
                        <img 
                          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${entry.asset.image}`} 
                          alt={entry.asset.name}
                          className="w-full h-full object-contain bg-white"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-[#EAD8B1]/20 flex items-center justify-center mx-auto rounded-md border border-[#EAD8B1]/50">
                        <span className="text-xs text-[#3A6D8C]">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 font-medium">
                    <span 
                      className="px-3 py-1 rounded-full text-xs inline-block"
                      style={{ 
                        backgroundColor: `${getActionColor(entry.action)}20`, 
                        color: getActionColor(entry.action)
                      }}
                    >
                      {entry.action || "N/A"}
                      {entry.imageChange ? " (Image Updated)" : ""}
                    </span>
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs inline-block ${
                        entry.asset?.status === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : entry.asset?.status === 'Assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : entry.asset?.status === 'Under Maintenance'
                          ? 'bg-red-100 text-red-800'
                          : entry.asset?.status === 'Returned'
                          ? 'bg-amber-100 text-amber-800'
                          : entry.asset?.status === 'Retired'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {entry.asset?.status || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 text-[#001F3F]">
                    {entry.asset?.quantity || "N/A"}
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 text-[#001F3F]">
                    {entry.asset?.expiryDate ? formatDate(entry.asset.expiryDate) : "N/A"}
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 text-[#001F3F]">
                    {entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 border-b border-[#6A9AB0]/10 text-[#3A6D8C]">
                    {entry.user || "N/A"}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-6 text-center text-[#3A6D8C] italic">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#6A9AB0]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>No history records found</span>
                    <span className="text-sm text-[#6A9AB0] mt-1">Try adjusting your search or filter</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </motion.div>
      
      {filteredHistory.length > 0 && (
        <div className="mt-4 text-right text-[#6A9AB0] text-sm">
          Showing {filteredHistory.length} {filteredHistory.length === 1 ? 'record' : 'records'}
        </div>
      )}
    </motion.div>
  );
};

export default AssetHistory;
