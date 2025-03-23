import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AssignAsset = () => {
  const [asset, setAsset] = useState("");
  const [user, setUser] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedAssets, setAssignedAssets] = useState([]);

  // Fetch Assets and Users
  const fetchAssetsAndUsers = async () => {
    try {
      const assetResponse = await fetch("http://localhost:5000/api/assets");
      const userResponse = await fetch("http://localhost:5000/api/users");
      const assignedResponse = await fetch("http://localhost:5000/api/assets/assigned");
  
      if (!assetResponse.ok || !userResponse.ok || !assignedResponse.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const assetData = await assetResponse.json();
      const userData = await userResponse.json();
      const assignedData = await assignedResponse.json();
  
      console.log("Assets:", assetData);
      console.log("Users:", userData);
      console.log("Assigned Assets:", assignedData);
  
      // Filter only available assets
      const availableAssets = assetData.filter((item) => item.status === "Available");
  
      setAssets(availableAssets);
      setUsers(userData);
      setAssignedAssets(assignedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAssignment = { assetId: asset, userId: user, assignedDate, dueDate, note };

    try {
      const response = await fetch("http://localhost:5000/api/assets/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) throw new Error("Failed to assign asset");

      alert("Asset Assigned Successfully!");
      fetchAssetsAndUsers();

      // Clear form fields
      setAsset("");
      setUser("");
      setAssignedDate("");
      setDueDate("");
      setNote("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error assigning asset");
    }
  };

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
            <option value="">-- Choose an Available Asset --</option>
            {assets.map((item) => (
              <option key={item._id} value={item._id}>{item.name} ({item.status})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Assign To</label>
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">-- Choose a User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Assignment Date</label>
          <input
            type="date"
            value={assignedDate}
            onChange={(e) => setAssignedDate(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-2">Assigned Assets</h3>
        {assignedAssets.length > 0 ? (
          <div className="border p-3 rounded-lg bg-gray-100 max-h-52 overflow-y-auto">
            <ul>
              {assignedAssets.map((assignment, index) => (
                <li key={index} className="border-b p-2 last:border-none">
                  <strong>{assignment.asset?.name}</strong> assigned to <strong>{assignment.user?.name}</strong> on {new Date(assignment.assignedDate).toLocaleDateString()} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
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
