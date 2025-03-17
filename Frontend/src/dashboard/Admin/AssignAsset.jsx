import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AssignAsset = () => {
  const [asset, setAsset] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [assignedAssets, setAssignedAssets] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAssignment = { asset, user, date, note };

    try {
      const response = await fetch("http://localhost:5000/api/assets/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) throw new Error("Failed to assign asset");

      const data = await response.json();
      alert("Asset Assigned Successfully!");

      // Clear form fields
      setAsset("");
      setUser("");
      setDate("");
      setNote("");

      // Refresh assigned assets
      fetchAssignedAssets();
    } catch (error) {
      console.error("Error:", error);
      alert("Error assigning asset");
    }
  };

  // Fetch assigned assets from backend
  const fetchAssignedAssets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/assets/assigned");
      if (!response.ok) throw new Error("Failed to fetch assigned assets");

      const data = await response.json();
      setAssignedAssets(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Load assigned assets on component mount
  useEffect(() => {
    fetchAssignedAssets();
  }, []);

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-2xl mx-auto mt-30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Assign Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">-- Choose an Asset --</option>
            <option value="Laptop">Laptop</option>
            <option value="Projector">Projector</option>
            <option value="Office Chair">Office Chair</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Assign To</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter employee name"
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Assignment Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Additional Notes</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional notes..."
            className="w-full p-3 border rounded-lg"
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full">
          Assign Asset
        </button>
      </form>

      {/* Display Assigned Assets with Scroll Feature */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-2">Assigned Assets</h3>
        {assignedAssets.length > 0 ? (
          <div className="border p-3 rounded-lg bg-gray-100 max-h-52 overflow-y-auto">
            <ul>
              {assignedAssets.map((assignment, index) => (
                <li key={index} className="border-b p-2 last:border-none">
                  <strong>{assignment.asset}</strong> assigned to <strong>{assignment.user}</strong> on {new Date(assignment.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">No assets assigned yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AssignAsset;
