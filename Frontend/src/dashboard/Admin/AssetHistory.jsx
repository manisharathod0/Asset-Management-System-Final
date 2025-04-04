
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaDownload } from "react-icons/fa";
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
      const response = await axios.get("http://localhost:5000/api/assets/history");
      setHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const filteredHistory = history
    .filter((entry) =>
      (filter === "All" || entry.action === filter) &&
      entry.asset?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (a.action === filter ? -1 : b.action === filter ? 1 : 0));

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
        ["Asset", "Action", "Status", "Date", "User", "Quantity", "Expiry Date", "Image Updated"],
        ...filteredHistory.map(({ asset, action, date, user, quantityChange, expiryDateChange, imageChange }) => [
          asset?.name || "N/A",
          action || "N/A",
          asset?.status || "N/A",
          date ? new Date(date).toLocaleDateString() : "N/A",
          user || "N/A",
          quantityChange ? asset?.quantity || "N/A" : "N/A",
          expiryDateChange ? (asset?.expiryDate ? formatDate(asset.expiryDate) : "N/A") : "N/A",
          imageChange ? "Yes" : "No"
        ])
      ].map((e) => e.join(",")).join("\n");
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
        head: [["Asset", "Action", "Status", "Date", "User", "Quantity", "Expiry Date", "Image Updated"]],
        body: filteredHistory.map(({ asset, action, date, user, quantityChange, expiryDateChange, imageChange }) => [
          asset?.name || "N/A",
          action || "N/A",
          asset?.status || "N/A",
          date ? new Date(date).toLocaleDateString() : "N/A",
          user || "N/A",
          quantityChange ? asset?.quantity || "N/A" : "N/A",
          expiryDateChange ? (asset?.expiryDate ? formatDate(asset.expiryDate) : "N/A") : "N/A",
          imageChange ? "Yes" : "No"
        ]),
      });
      doc.save("asset_history.pdf");
    } else if (exportFormat === "excel") {
      const data = filteredHistory.map(({ asset, action, date, user, quantityChange, expiryDateChange, imageChange }) => ({
        Asset: asset?.name || "N/A",
        Action: action || "N/A",
        Status: asset?.status || "N/A",
        Date: date ? new Date(date).toLocaleDateString() : "N/A",
        User: user || "N/A",
        Quantity: quantityChange ? asset?.quantity || "N/A" : "N/A",
        "Expiry Date": expiryDateChange ? (asset?.expiryDate ? formatDate(asset.expiryDate) : "N/A") : "N/A",
        "Image Updated": imageChange ? "Yes" : "No"
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asset History");
      XLSX.writeFile(wb, "asset_history.xlsx");
    }
  };

  return (
    <motion.div className="p-6 bg-white shadow-lg rounded-xl max-w-6xl mx-auto mt-20">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset History</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 border rounded-lg">
          <option value="All">All Actions</option>
          <option value="Created">Created</option>
          <option value="Updated">Updated</option>
          <option value="Deleted">Deleted</option>
          <option value="Assigned">Assigned</option>
          <option value="Returned">Returned</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="p-3 border rounded-lg">
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
        <button className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg" onClick={handleExport}>
          <FaDownload /> Export
        </button>
      </div>
      <motion.div className="overflow-x-auto">
        <motion.table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Action</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Expiry Date</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">User</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((entry) => (
                <motion.tr key={entry._id} className="text-center bg-gray-100 hover:bg-gray-200 transition">
                  <td className="p-3 border">{entry.asset?.name || "N/A"}</td>
                  <td className="p-3 border">
                    {entry.asset?.image ? (
                      <div className="w-12 h-12 mx-auto">
                        <img 
                          src={`http://localhost:5000/uploads/${entry.asset.image}`} 
                          alt={entry.asset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mx-auto">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </td>
                  <td className={`p-3 border font-semibold ${
                    entry.action === "Created" ? "text-green-600" :
                    entry.action === "Updated" ? "text-orange-600" :
                    entry.action === "Deleted" ? "text-red-600" :
                    entry.action === "Assigned" ? "text-blue-600" :
                    entry.action === "Returned" ? "text-indigo-600" :
                    "text-gray-600"
                  }`}>
                    {entry.action || "N/A"}
                    {entry.imageChange ? " (Image Updated)" : ""}
                  </td>
                  <td className="p-3 border font-semibold">{entry.asset?.status || "N/A"}</td>
                  <td className="p-3 border">{entry.asset?.quantity || "N/A"}</td>
                  <td className="p-3 border">{entry.asset?.expiryDate ? formatDate(entry.asset.expiryDate) : "N/A"}</td>
                  <td className="p-3 border">{entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}</td>
                  <td className="p-3 border">{entry.user || "N/A"}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">No history found</td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </motion.div>
    </motion.div>
  );
};

export default AssetHistory;