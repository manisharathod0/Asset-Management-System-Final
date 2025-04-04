// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { FaDownload } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";


// const RequestRepair = () => {
//   const [search, setSearch] = useState("");
//   const [repairLogs, setRepairLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Initialize navigate function

//   useEffect(() => {
//     const fetchScheduledMaintenance = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/maintenance/scheduled-maintenance");
//         setRepairLogs(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching scheduled maintenance:", err);
//         setError("Failed to fetch scheduled maintenance.");
//         setLoading(false);
//       }
//     };
//     fetchScheduledMaintenance();
//   }, []);


//   const handleScheduleMaintenance = (id) => {
//     navigate(`/admin/scheduled-maintenance`); // Redirect with ID
//   };


//   const handleCompleteMaintenance = async (id) => {
//     const confirmed = window.confirm("Are you sure you want to mark this maintenance as complete?");
//     if (!confirmed) return;

//     try {
//       await axios.put(`http://localhost:5000/api/maintenance/scheduled-maintenance/${id}`, { status: "Completed" });
//       setRepairLogs((prevLogs) =>
//         prevLogs.map((log) => (log._id === id ? { ...log, status: "Completed" } : log))
//       );
//     } catch (err) {
//       console.error("Error completing maintenance:", err);
//       setError("Failed to complete maintenance.");
//     }
//   };

//   const handleDeleteMaintenance = async (id) => {
//     const confirmed = window.confirm("Are you sure you want to delete this maintenance record?");
//     if (!confirmed) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/maintenance/scheduled-maintenance/${id}`);
//       setRepairLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
//     } catch (err) {
//       console.error("Error deleting maintenance:", err);
//       setError("Failed to delete maintenance.");
//     }
//   };

//   const handleDownload = () => {
//     const csv = convertToCSV(repairLogs);
//     downloadCSV(csv, "repair_logs.csv");
//   };

//   const convertToCSV = (data) => {
//     if (data.length === 0) return "No data available";
//     const headers = Object.keys(data[0]).join(",");
//     const rows = data.map((row) => Object.values(row).join(","));
//     return `${headers}\n${rows.join("\n")}`;
//   };

//   const downloadCSV = (csv, filename) => {
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <motion.div
//       className="p-6 bg-white m-40 shadow-lg rounded-xl w-90vh mx-auto"
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Repair Requests</h2>

//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Search assets..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="p-3 flex-grow border rounded-lg focus:outline-none"
//         />
//         <button onClick={handleDownload} className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg">
//           <FaDownload />
//         </button>
//       </div>

//       <motion.table
//         className="w-full border-collapse border border-gray-300"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2 }}
//       >
//         <thead>
//   <tr className="bg-[#3A6D8C] text-white">
//     <th className="p-3 border">Asset</th>
//     <th className="p-3 border">Technician</th> {/* Added Technician column */}
//     <th className="p-3 border">Task</th>
//     <th className="p-3 border">Date Logged</th>
//     <th className="p-3 border">Status</th>
//     <th className="p-3 border">Actions</th>
//   </tr>
// </thead>

// <tbody>
//   {repairLogs.map((entry) => (
//     <motion.tr
//       key={entry._id}
//       className="text-center bg-gray-100 hover:bg-gray-200 transition"
//       initial={{ x: -10, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//     >
//       <td className="p-3 border">{entry.assetName || "N/A"}</td> {/* Ensure asset name is visible */}
//       <td className="p-3 border">{entry.technician || "Unassigned"}</td> {/* Display technician name */}
//       <td className="p-3 border">{entry.task}</td>
//       <td className="p-3 border">{entry.date}</td>
//       <td
//         className={`p-3 border font-semibold ${
//           entry.status === "Completed"
//             ? "text-green-600"
//             : entry.status === "pending"
//             ? "text-yellow-600"
//             : entry.status === "Scheduled"
//             ? "text-blue-600"
//             : "text-red-600"
//         }`}
//       >
//         {entry.status}
//       </td>
//           <td className="p-3 border">
//             {entry.status?.trim().toLowerCase() === "pending" ? (
//               <button
//                 onClick={() => handleScheduleMaintenance(entry._id)}
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Schedule
//               </button>
//             ) : entry.status?.trim().toLowerCase() === "scheduled" ? (
//               <>
//                 <button
//                   onClick={() => handleCompleteMaintenance(entry._id)}
//                   className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Complete
//                 </button>
//                 <button
//                   onClick={() => handleDeleteMaintenance(entry._id)}
//                   className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Delete
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => handleDeleteMaintenance(entry._id)}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Delete
//               </button>
//             )}
//           </td>
//     </motion.tr>
//   ))}
// </tbody>

//       </motion.table>
//     </motion.div>
//   );
// };

// export default RequestRepair;


import { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaSearch, FaCalendarCheck, FaTrash, FaClipboardCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RequestRepair = () => {
  const [search, setSearch] = useState("");
  const [repairLogs, setRepairLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScheduledMaintenance = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/maintenance/scheduled-maintenance`);
        setRepairLogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scheduled maintenance:", err);
        setError("Failed to fetch scheduled maintenance.");
        setLoading(false);
      }
    };
    fetchScheduledMaintenance();
  }, []);

  const handleScheduleMaintenance = (id) => {
    navigate(`/admin/scheduled-maintenance`);
  };

  const handleCompleteMaintenance = async (id) => {
    const confirmed = window.confirm("Are you sure you want to mark this maintenance as complete?");
    if (!confirmed) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/maintenance/scheduled-maintenance/${id}`, { status: "Completed" });
      setRepairLogs((prevLogs) =>
        prevLogs.map((log) => (log._id === id ? { ...log, status: "Completed" } : log))
      );
    } catch (err) {
      console.error("Error completing maintenance:", err);
      setError("Failed to complete maintenance.");
    }
  };

  const handleDeleteMaintenance = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this maintenance record?");
    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/maintenance/scheduled-maintenance/${id}`);
      setRepairLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
    } catch (err) {
      console.error("Error deleting maintenance:", err);
      setError("Failed to delete maintenance.");
    }
  };

  const handleDownload = () => {
    const csv = convertToCSV(repairLogs);
    downloadCSV(csv, "repair_logs.csv");
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "No data available";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    return `${headers}\n${rows.join("\n")}`;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get filtered repair logs based on search
  const filteredLogs = repairLogs.filter(log => 
    log.assetName?.toLowerCase().includes(search.toLowerCase()) || 
    log.technician?.toLowerCase().includes(search.toLowerCase()) ||
    log.task?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EAD8B1]/30 to-[#6A9AB0]/30 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-[#001F3F] border-r-[#3A6D8C] border-b-[#6A9AB0] border-l-[#EAD8B1] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EAD8B1]/30 to-[#6A9AB0]/30 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-500">
          <h3 className="text-2xl font-bold text-[#001F3F] mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAD8B1]/30 to-[#6A9AB0]/30 py-8 px-4 mt-25 ">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-[#6A9AB0]/20">
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-r from-[#001F3F] to-[#3A6D8C] p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5"></path>
              <path d="M0,50 Q25,25 50,50 T100,50" stroke="white" strokeWidth="0.5" fill="none"></path>
              <path d="M0,60 Q35,80 70,60 T100,60" stroke="white" strokeWidth="0.5" fill="none"></path>
              <path d="M0,40 Q45,20 80,40 T100,40" stroke="white" strokeWidth="0.5" fill="none"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-center relative z-10">
            Maintenance & Repair Requests
          </h2>
        </div>

        {/* Search and Controls */}
        <div className="p-6 border-b border-[#EAD8B1]/30">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#3A6D8C]">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search by asset, technician or task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 pl-10 bg-[#EAD8B1]/10 border border-[#6A9AB0]/30 rounded-xl focus:ring-2 focus:ring-[#3A6D8C]/50 focus:border-[#3A6D8C] transition-all duration-300 outline-none text-[#001F3F]"
              />
            </div>
            <button 
              onClick={handleDownload} 
              className="flex items-center gap-2 bg-gradient-to-r from-[#001F3F] to-[#3A6D8C] text-white py-3 px-5 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Table Container with Custom Scrollbar */}
        <div 
          className="p-6 overflow-x-auto overflow-y-auto max-h-[600px] scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#6A9AB0 #EAD8B1'
          }}
        >
          {filteredLogs.length === 0 ? (
            <div className="text-center py-20 text-[#3A6D8C]">
              <p className="text-xl">No maintenance records found</p>
              {search && <p className="mt-2">Try adjusting your search</p>}
            </div>
          ) : (
            <table className="w-full rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#3A6D8C] text-white">
                  <th className="p-4 text-left rounded-tl-xl">Asset</th>
                  <th className="p-4 text-left">Technician</th>
                  <th className="p-4 text-left">Task Description</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8B1]/30">
                {filteredLogs.map((entry, index) => (
                  <tr
                    key={entry._id}
                    className="text-[#001F3F] transition-all duration-200 hover:bg-[#EAD8B1]/10"
                  >
                    <td className="p-4">
                      <div className="font-medium">{entry.assetName || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#6A9AB0] text-white flex items-center justify-center mr-2 font-medium">
                          {entry.technician ? entry.technician.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span>{entry.technician || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="line-clamp-2">{entry.task}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          entry.status?.toLowerCase() === "completed"
                            ? "bg-green-100 text-green-800"
                            : entry.status?.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : entry.status?.toLowerCase() === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {entry.status?.trim().toLowerCase() === "pending" ? (
                          <button
                            onClick={() => handleScheduleMaintenance(entry._id)}
                            className="bg-[#3A6D8C] hover:bg-[#001F3F] text-white py-2 px-3 rounded-lg flex items-center gap-1 transition-colors duration-300"
                          >
                            <FaCalendarCheck />
                            <span>Schedule</span>
                          </button>
                        ) : entry.status?.trim().toLowerCase() === "scheduled" ? (
                          <>
                            <button
                              onClick={() => handleCompleteMaintenance(entry._id)}
                              className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg flex items-center gap-1 transition-colors duration-300"
                            >
                              <FaClipboardCheck />
                              <span>Complete</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMaintenance(entry._id)}
                              className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center gap-1 transition-colors duration-300"
                            >
                              <FaTrash />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDeleteMaintenance(entry._id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center gap-1 transition-colors duration-300"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#EAD8B1]/20 to-[#6A9AB0]/20 text-center text-[#001F3F]">
          <p>Total Records: {filteredLogs.length}</p>
        </div>
      </div>
    </div>
  );
};

export default RequestRepair;