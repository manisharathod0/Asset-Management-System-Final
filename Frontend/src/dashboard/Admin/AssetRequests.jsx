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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/assetrequests");
      setRequests(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching asset requests:", error);
      setError("Failed to load asset requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/assetrequests/${id}`, { status: newStatus });
      setRequests(requests.map((req) => (req._id === id ? { ...req, status: newStatus } : req)));
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredRequests = requests.filter(
    (req) =>
      (filter === "All" || req.status === filter) &&
      (req.assetName?.toLowerCase().includes(search.toLowerCase()) || 
       req.assetId?.toLowerCase().includes(search.toLowerCase()) ||
       req.category?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExport = () => {
    if (!filteredRequests.length) {
      alert("No data available for export!");
      return;
    }

    const exportData = filteredRequests.map(req => ({
      'Asset ID': req.assetId,
      'Asset Name': req.assetName,
      'Category': req.category,
      'Requested By': req.requestedBy || 'Employee',
      'Date': formatDate(req.date),
      'Status': req.status,
      'Reason': req.reason
    }));

    if (exportFormat === "csv") {
      const headers = Object.keys(exportData[0]).join(',');
      const csvData = exportData.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = `${headers}\n${csvData}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "asset_requests.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("Asset Requests", 14, 10);
      
      autoTable(doc, {
        head: [Object.keys(exportData[0])],
        body: exportData.map(row => Object.values(row)),
        margin: { top: 20 }
      });
      
      doc.save("asset_requests.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asset Requests");
      XLSX.writeFile(wb, "asset_requests.xlsx");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-30 bg-white shadow-lg rounded-xl">
        <p className="text-red-500 text-center text-lg">{error}</p>
        <button 
          onClick={fetchRequests}
          className="mt-4 mx-auto block bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6 mt-30 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset Requests</h2>
      
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg"
        />
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="p-3 border rounded-lg"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select 
          value={exportFormat} 
          onChange={(e) => setExportFormat(e.target.value)} 
          className="p-3 border rounded-lg"
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
        <button 
          className="bg-blue-500 text-white px-4 py-2 flex items-center gap-2 rounded-lg hover:bg-blue-600" 
          onClick={handleExport}
        >
          <FaDownload /> Export
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No asset requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-10">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#3A6D8C] text-white">
                <th className="p-3 border">Asset ID</th>
                <th className="p-3 border">Asset Name</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Requested By</th>
                <th className="p-3 border">Request Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <motion.tr 
                  key={req._id} 
                  className="text-center bg-gray-100 hover:bg-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="p-3 border">{req.assetId}</td>
                  <td className="p-3 border">{req.assetName}</td>
                  <td className="p-3 border">{req.category}</td>
                  <td className="p-3 border">{req.requestedBy || 'Employee'}</td>
                  <td className="p-3 border">{formatDate(req.date)}</td>
                  <td className={`p-3 border font-medium ${
                    req.status === "Pending" ? "text-yellow-600" : 
                    req.status === "Approved" ? "text-green-600" : 
                    "text-red-600"
                  }`}>
                    {req.status}
                  </td>
                  <td className="p-3 border flex flex-col sm:flex-row justify-center gap-2">
                    {req.status === "Pending" && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(req._id, "Approved")} 
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusChange(req._id, "Rejected")} 
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status !== "Pending" && (
                      <span className="text-sm text-gray-500 italic">
                        {req.status === "Approved" ? "Approved" : "Rejected"}
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AssetRequests;