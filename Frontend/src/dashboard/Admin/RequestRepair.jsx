import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const RequestRepair = () => {
  const [search, setSearch] = useState("");
  const [repairLogs, setRepairLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchScheduledMaintenance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/maintenance/scheduled-maintenance");
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
    navigate(`/admin/scheduled-maintenance`); // Redirect with ID
  };


  const handleCompleteMaintenance = async (id) => {
    const confirmed = window.confirm("Are you sure you want to mark this maintenance as complete?");
    if (!confirmed) return;

    try {
      await axios.put(`http://localhost:5000/api/maintenance/scheduled-maintenance/${id}`, { status: "Completed" });
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
      await axios.delete(`http://localhost:5000/api/maintenance/scheduled-maintenance/${id}`);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <motion.div
      className="p-6 bg-white m-40 shadow-lg rounded-xl w-90vh mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Repair Requests</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
        <button onClick={handleDownload} className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg">
          <FaDownload />
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
    <th className="p-3 border">Asset</th>
    <th className="p-3 border">Technician</th> {/* Added Technician column */}
    <th className="p-3 border">Task</th>
    <th className="p-3 border">Date Logged</th>
    <th className="p-3 border">Status</th>
    <th className="p-3 border">Actions</th>
  </tr>
</thead>

<tbody>
  {repairLogs.map((entry) => (
    <motion.tr
      key={entry._id}
      className="text-center bg-gray-100 hover:bg-gray-200 transition"
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <td className="p-3 border">{entry.asset || "N/A"}</td> {/* Ensure asset name is visible */}
      <td className="p-3 border">{entry.technicianName || "Unassigned"}</td> {/* Display technician name */}
      <td className="p-3 border">{entry.task}</td>
      <td className="p-3 border">{entry.date}</td>
      <td
        className={`p-3 border font-semibold ${
          entry.status === "Completed"
            ? "text-green-600"
            : entry.status === "pending"
            ? "text-yellow-600"
            : entry.status === "Scheduled"
            ? "text-blue-600"
            : "text-red-600"
        }`}
      >
        {entry.status}
      </td>
          <td className="p-3 border">
            {entry.status?.trim().toLowerCase() === "pending" ? (
              <button
                onClick={() => handleScheduleMaintenance(entry._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Schedule
              </button>
            ) : entry.status?.trim().toLowerCase() === "scheduled" ? (
              <>
                <button
                  onClick={() => handleCompleteMaintenance(entry._id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleDeleteMaintenance(entry._id)}
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => handleDeleteMaintenance(entry._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            )}
          </td>
    </motion.tr>
  ))}
</tbody>

      </motion.table>
    </motion.div>
  );
};

export default RequestRepair;
