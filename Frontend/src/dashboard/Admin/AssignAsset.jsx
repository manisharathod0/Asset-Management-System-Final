import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SelectField = ({ label, value, onChange, options, placeholder, isAsset = false }) => (
  <div>
    <label className="block font-medium">{label}</label>
    <select value={value} onChange={onChange} className="w-full p-3 border rounded-lg" required>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option._id} value={option._id}>
          {isAsset 
            ? `AST-${option._id.slice(-6).toUpperCase()} - ${option.name} (${option.category})` 
            : option.name}
        </option>
      ))}
    </select>
  </div>
);

const AssignAsset = () => {
  const [asset, setAsset] = useState("");
  const [user, setUser] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAssetsAndUsers = async () => {
    try {
      const [assetResponse, userResponse] = await Promise.all([
        fetch("http://localhost:5000/api/assets"),
        fetch("http://localhost:5000/api/users"),
      ]);

      if (!assetResponse.ok || !userResponse.ok) {
        throw new Error("Failed to fetch data. Please try again.");
      }

      const assetData = await assetResponse.json();
      const userData = await userResponse.json();

      const availableAssets = assetData.filter((item) => item.status === "Available");

      setAssets(availableAssets);
      setUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetsAndUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignedDate || !dueDate) {
      return setErrorMessage("Please select valid dates.");
    }

    if (new Date(dueDate) < new Date(assignedDate)) {
      return setErrorMessage("Due Date cannot be before Assignment Date.");
    }

    const newAssignment = { assetId: asset, userId: user, assignedDate, dueDate, note };

    try {
      const response = await fetch("http://localhost:5000/api/assign/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign asset.");
      }

      setSuccessMessage("Asset assigned successfully!");
      fetchAssetsAndUsers();

      setAsset("");
      setUser("");
      setAssignedDate("");
      setDueDate("");
      setNote("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <motion.div
      className="p-6 bg-white shadow-lg rounded-xl max-w-2xl mx-auto mt-30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Assign Asset</h2>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField 
            label="Select Asset" 
            value={asset} 
            onChange={(e) => setAsset(e.target.value)} 
            options={assets} 
            placeholder="-- Choose an Available Asset --" 
            isAsset={true} 
          />

          <SelectField 
            label="Assign To" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            options={users} 
            placeholder="-- Choose a User --" 
          />

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

          <button 
            type="submit" 
            className={`text-white px-6 py-2 rounded-lg w-full ${
              asset && user && assignedDate && dueDate 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-400 cursor-not-allowed"
            }`} 
            disabled={!asset || !user || !assignedDate || !dueDate || loading}
          >
            {loading ? "Assigning..." : "Assign Asset"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default AssignAsset;