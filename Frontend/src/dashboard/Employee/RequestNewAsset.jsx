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
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option._id} value={option._id}>
              {isAsset 
                ? `AST-${option._id.slice(-6).toUpperCase()} - ${option.name} (${option.category})` 
                : option.name}
            </option>
          ))
        ) : (
          <option value="" disabled>No assets available</option>
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3A6D8C">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

const RequestNewAsset = () => {
  const [formData, setFormData] = useState({
    assetId: "",
    reason: "",
  });
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Color palette
  const colors = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    sand: "#EAD8B1"
  };

  // Different color theme for this component
  const theme = {
    primary: colors.darkBlue,
    secondary: colors.sand,
    accent: colors.lightBlue,
    background: colors.mediumBlue,
    text: "#ffffff"
  };

  // Fetch available assets when component mounts
  useEffect(() => {
    fetchAvailableAssets();
  }, []);

  const fetchAvailableAssets = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
    const token = user?.token;

    if (!token) {
      setError("Authentication token not found. Please login.");
      setLoading(false);
      return;
    }

    try {
      // Using the same endpoint as in AssignAsset.jsx for consistency
      const response = await fetch("http://localhost:5000/api/assets", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch available assets");
      }

      const data = await response.json();
      // Filter to only show available assets
      const availableAssets = data.filter(asset => asset.status === "Available");
      
      console.log("Available assets:", availableAssets); // Debugging
      setAvailableAssets(availableAssets);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err.message || "Error fetching available assets");
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedAsset(selectedValue);
    
    if (selectedValue) {
      setFormData(prev => ({
        ...prev,
        assetId: selectedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assetId: ""
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/assetrequests", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}`
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Submission failed.");
      }
      
      setSubmitted(true);
      
      // Clear the form after submission
      setFormData({
        assetId: "",
        reason: "",
      });
      setSelectedAsset("");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-6 mt-20"
         style={{ backgroundColor: theme.accent, backgroundImage: `linear-gradient(135deg, ${colors.lightBlue}50, ${colors.darkBlue}90)` }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          backgroundColor: theme.secondary, 
          boxShadow: `0 15px 35px rgba(0, 31, 63, 0.25)`,
          borderRight: `4px solid ${theme.primary}`
        }}
        className="w-full max-w-2xl p-8 rounded-3xl overflow-hidden relative"
      >
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ backgroundColor: theme.primary }}
          className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{ backgroundColor: theme.accent }}
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ backgroundColor: theme.background }}
          className="absolute bottom-1/3 -right-10 w-20 h-20 rounded-full"
        ></motion.div>
        
        {/* Header */}
        <div className="relative z-10 mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ color: theme.primary }} 
            className="text-3xl font-bold mb-2"
          >
            Request New Asset
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ backgroundColor: theme.background, height: "4px" }}
            className="mb-3"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ color: theme.primary }} 
            className="text-sm"
          >
            Please select an asset and provide details for your request
          </motion.p>
        </div>
        
        {submitted ? (
          <motion.div 
            className="text-center py-12"
            variants={successVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              style={{ backgroundColor: theme.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <motion.h3 
              style={{ color: theme.primary }} 
              className="text-2xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Asset Request Submitted Successfully!
            </motion.h3>
            <motion.p 
              style={{ color: theme.background }} 
              className="mb-6 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your asset request has been submitted and will be reviewed by our team shortly.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubmitted(false)}
              style={{ backgroundColor: theme.primary, color: theme.text }}
              className="px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Request Another Asset
            </motion.button>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit} 
            className="relative z-10 grid grid-cols-1 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <motion.div variants={itemVariants} className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.primary }}></div>
              </motion.div>
            ) : error && error.includes("Authentication") ? (
              <motion.div variants={itemVariants} className="text-center py-5">
                <p className="text-red-600 mb-3">{error}</p>
                <button
                  onClick={() => window.location.href = "/login"}
                  style={{ backgroundColor: theme.primary, color: theme.text }}
                  className="px-5 py-2 rounded-lg"
                >
                  Go to Login
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <SelectField 
                    label="Select Asset" 
                    value={selectedAsset} 
                    onChange={handleAssetSelect} 
                    options={availableAssets} 
                    placeholder="-- Choose an Available Asset --" 
                    isAsset={true} 
                  />
                  {availableAssets.length === 0 && !loading && (
                    <p className="mt-1 text-sm text-red-500">No available assets found</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block font-medium mb-2" style={{ color: theme.primary }}>
                    Reason for Request
                  </label>
                  <textarea 
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all duration-200"
                    style={{ 
                      borderColor: '#6A9AB0', 
                      backgroundColor: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      focusRing: '#3A6D8C',
                      minHeight: '150px'
                    }}
                    placeholder="Explain why you need this asset"
                    required
                  ></textarea>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: theme.background }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={isSubmitting || !formData.assetId}
                    style={{ 
                      backgroundColor: formData.assetId ? theme.primary : '#CBD5E0',
                      opacity: isSubmitting ? 0.7 : 1,
                      color: theme.text,
                      cursor: formData.assetId ? 'pointer' : 'not-allowed'
                    }}
                    className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </motion.button>
                </motion.div>
              </>
            )}
            
            {error && !error.includes("Authentication") && (
              <motion.div 
                variants={itemVariants}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: "#e53e3e",
                    textAlign: "center",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "rgba(229, 62, 62, 0.1)",
                  }}
                >
                  {error}
                </motion.p>
              </motion.div>
            )}
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default RequestNewAsset;