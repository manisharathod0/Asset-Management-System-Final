import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SelectField = ({ label, value, onChange, options, placeholder, isAsset = false }) => (
  <div className="mb-4">
    <label className="block font-medium mb-2" style={{ color: '#001F3F' }}>{label}</label>
    <div className="relative">
      <select 
        value={value} 
        onChange={onChange} 
        className="w-full p-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:border-transparent pl-4 pr-10 transition-all duration-200"
        style={{ 
          borderColor: '#6A9AB0', 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          focusRing: '#3A6D8C'
        }}
        required
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {isAsset 
              ? `AST-${option._id.slice(-6).toUpperCase()} - ${option.name} (${option.category})` 
              : option.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3A6D8C">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

const DateField = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block font-medium mb-2" style={{ color: '#001F3F' }}>{label}</label>
    <input 
      type="date" 
      value={value} 
      onChange={onChange} 
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
      style={{ 
        borderColor: '#6A9AB0', 
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        focusRing: '#3A6D8C'
      }}
      required 
    />
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
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assets`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`),
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assign/`, {
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
      className="p-8 max-w-2xl mx-auto mt-8 rounded-xl mt-25"
      style={{ background: 'linear-gradient(135deg, #EAD8B1 0%, #FFFFFF 100%)' }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4" style={{ borderColor: '#001F3F' }}>
        <div className="flex items-center justify-center mb-6">
          <div className="p-2 rounded-full mr-3" style={{ backgroundColor: '#EAD8B1' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#001F3F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: '#001F3F' }}>Assign Asset</h2>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-red-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
            <p className="text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center p-6">
            <div className="inline-block p-3 rounded-full" style={{ backgroundColor: '#3A6D8C' }}>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-2" style={{ color: '#3A6D8C' }}>Loading assets and users...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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

            <DateField 
              label="Assignment Date"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
            />

            <DateField 
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="mb-6">
              <label className="block font-medium mb-2" style={{ color: '#001F3F' }}>Additional Notes</label>
              <textarea 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="Optional notes..." 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{ 
                  borderColor: '#6A9AB0', 
                  minHeight: '100px',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  focusRing: '#3A6D8C'
                }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-102 hover:shadow-lg"
              style={{ 
                background: asset && user && assignedDate && dueDate 
                  ? 'linear-gradient(90deg, #001F3F 0%, #3A6D8C 100%)' 
                  : '#CBD5E0',
                cursor: asset && user && assignedDate && dueDate ? 'pointer' : 'not-allowed'
              }}
              disabled={!asset || !user || !assignedDate || !dueDate || loading}
            >
              {loading ? "Assigning..." : "Assign Asset"}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default AssignAsset;