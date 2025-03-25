import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";

const AssetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/asset-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching asset requests:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/asset-requests/${id}`, { status: newStatus });
      setRequests(requests.map((req) => (req._id === id ? { ...req, status: newStatus } : req)));
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      (filter === "All" || req.status === filter) &&
      req.asset.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    if (!filteredRequests.length) {
      alert("No data available for export!");
      return;
    }

    if (exportFormat === "csv") {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [Object.keys(filteredRequests[0]).join(","),
        ...filteredRequests.map((row) => Object.values(row).join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "asset_requests.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("Asset Requests", 14, 10);
      autoTable(doc, {
        head: [Object.keys(filteredRequests[0])],
        body: filteredRequests.map((row) => Object.values(row)),
      });
      doc.save("asset_requests.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredRequests);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asset Requests");
      XLSX.writeFile(wb, "asset_requests.xlsx");
    } else {
      alert("Unsupported export format!");
    }
  };

  return (
    <motion.div className="p-6 mt-30 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset Requests</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 border rounded-lg">
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
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

      <div className="overflow-x-auto mt-10">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset</th>
              <th className="p-3 border">Requested By</th>
              <th className="p-3 border">Request Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <motion.tr key={req._id} className="text-center bg-gray-100 hover:bg-gray-200">
                <td className="p-3 border">{req.asset}</td>
                <td className="p-3 border">{req.requestedBy}</td>
                <td className="p-3 border">{req.requestDate}</td>
                <td className={`p-3 border ${req.status === "Pending" ? "text-yellow-600" : req.status === "Approved" ? "text-green-600" : "text-red-600"}`}>{req.status}</td>
                <td className="p-3 border flex justify-center gap-2">
                  {req.status !== "Approved" && <button onClick={() => handleStatusChange(req._id, "Approved")} className="bg-green-500 text-white px-3 py-1 rounded-lg">Approve</button>}
                  {req.status !== "Rejected" && <button onClick={() => handleStatusChange(req._id, "Rejected")} className="bg-red-500 text-white px-3 py-1 rounded-lg">Reject</button>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AssetRequests;
