import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaDownload, 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaSyncAlt,
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaClipboardList
} from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { MdCategory, MdPending } from "react-icons/md";
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
  const [showExportOptions, setShowExportOptions] = useState(false);

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

  const handleExport = (format) => {
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

    if (format === "csv") {
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
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.text("Asset Requests", 14, 10);
      
      autoTable(doc, {
        head: [Object.keys(exportData[0])],
        body: exportData.map(row => Object.values(row)),
        margin: { top: 20 }
      });
      
      doc.save("asset_requests.pdf");
    } else if (format === "excel") {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asset Requests");
      XLSX.writeFile(wb, "asset_requests.xlsx");
    }
    
    setShowExportOptions(false);
  };

  const StatusBadge = ({ status }) => {
    let icon, bgColor, textColor;
    
    switch (status) {
      case "Pending":
        icon = <MdPending className="mr-1" />;
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        break;
      case "Approved":
        icon = <FaCheckCircle className="mr-1" />;
        bgColor = "bg-green-100";
        textColor = "text-green-700";
        break;
      case "Rejected":
        icon = <FaTimesCircle className="mr-1" />;
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        break;
      default:
        icon = <FaExclamationTriangle className="mr-1" />;
        bgColor = "bg-gray-100";
        textColor = "text-gray-700";
    }
    
    return (
      <div className={`flex items-center justify-center px-3 py-1 rounded-full ${bgColor} ${textColor} font-medium text-sm`}>
        {icon}
        {status}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-white shadow-lg rounded-xl p-6 mt-25">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <p className="text-gray-600 font-medium">Loading asset requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 mt-10 bg-white shadow-lg rounded-xl">
        <div className="flex flex-col items-center">
          <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
          <p className="text-red-500 text-center text-lg font-medium mb-4">{error}</p>
          <button 
            onClick={fetchRequests}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            <FaSyncAlt className="animate-spin" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-8 mt-10 bg-white shadow-lg rounded-xl mt-25"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center flex items-center justify-center">
        <FaClipboardList className="mr-3 text-blue-500" />
        Asset Requests
      </h2>
      
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by asset name, ID, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 pl-10 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="p-3 pl-10 border border-gray-300 rounded-lg appearance-none pr-10 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <button 
            className="bg-blue-500 text-white px-6 py-3 flex items-center gap-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md w-full justify-center md:w-auto" 
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            <FaDownload /> 
            Export
          </button>
          
          <AnimatePresence>
            {showExportOptions && (
              <motion.div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => handleExport("csv")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <FaFileAlt className="text-green-600" />
                  <span>CSV</span>
                </button>
                <button 
                  onClick={() => handleExport("pdf")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <HiOutlineDocumentDownload className="text-red-600" />
                  <span>PDF</span>
                </button>
                <button 
                  onClick={() => handleExport("excel")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <FaFileAlt className="text-blue-600" />
                  <span>Excel</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <motion.div 
          className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FaClipboardList className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">No asset requests found.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria.</p>
        </motion.div>
      ) : (
        <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r bg-[#001F3F] text-white">
                <th className="p-4 text-left font-semibold">Asset ID</th>
                <th className="p-4 text-left font-semibold">Asset Name</th>
                <th className="p-4 text-left font-semibold">Category</th>
                <th className="p-4 text-left font-semibold">Requested By</th>
                <th className="p-4 text-left font-semibold">Request Date</th>
                <th className="p-4 text-center font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req, index) => (
                <motion.tr 
                  key={req._id} 
                  className={`text-gray-700 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <FaTag className="text-blue-500 mr-2" />
                      {req.assetId}
                    </div>
                  </td>
                  <td className="p-4 border-t border-gray-200 font-medium">{req.assetName}</td>
                  <td className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <MdCategory className="text-blue-500 mr-2" />
                      {req.category}
                    </div>
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <FaUser className="text-blue-500 mr-2" />
                      {req.requestedBy || 'Employee'}
                    </div>
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      {formatDate(req.date)}
                    </div>
                  </td>
                  <td className="p-4 border-t border-gray-200 text-center">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    <div className="flex justify-center gap-2">
                      {req.status === "Pending" && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(req._id, "Approved")} 
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm shadow-sm"
                          >
                            <FaCheckCircle />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusChange(req._id, "Rejected")} 
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 text-sm shadow-sm"
                          >
                            <FaTimesCircle />
                            Reject
                          </button>
                        </>
                      )}
                      {req.status !== "Pending" && (
                        <span className="text-sm text-gray-500 italic flex items-center">
                          {req.status === "Approved" ? 
                            <><FaCheckCircle className="text-green-500 mr-1" /> Request approved</> : 
                            <><FaTimesCircle className="text-red-500 mr-1" /> Request rejected</>}
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Showing {filteredRequests.length} of {requests.length} total requests
      </div>
    </motion.div>
  );
};

export default AssetRequests;