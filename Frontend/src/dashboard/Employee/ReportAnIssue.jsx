
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ReportAnIssue = () => {
  const [assetName, setAssetName] = useState("");
  const [assetId, setAssetId] = useState("");
  const [category, setCategory] = useState("");
  const [issue, setIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");

  // Color palette
  const colors = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    sand: "#EAD8B1"
  };

  useEffect(() => {
    fetchMyAssets();
  }, []);

  const fetchMyAssets = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
    const token = user?.token;

    if (!token) {
      setError("Authentication token not found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/assign/my-assets", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch assets");
      }

      const data = await response.json();
      setMyAssets(data);
    } catch (error) {
      setError("Failed to load your assets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedAssetId(selectedId);
    
    if (selectedId) {
      const selectedAsset = myAssets.find(asset => asset._id === selectedId);
      if (selectedAsset && selectedAsset.asset) {
        setAssetName(selectedAsset.asset.name || "");
        // Format the asset ID to be consistent (e.g., AST-12345)
        const formattedId = selectedAsset.asset.assetId || 
                          (selectedAsset.asset._id ? `AST-${selectedAsset.asset._id.slice(-5).toUpperCase()}` : "");
        setAssetId(formattedId);
        
        // We'll still try to get category but user can change it from dropdown
        if (selectedAsset.asset.category) {
          setCategory(selectedAsset.asset.category);
        } else if (selectedAsset.asset.type) {
          setCategory(selectedAsset.asset.type);
        } else {
          // Make an additional request to get full asset details if needed
          fetchAssetDetails(selectedAsset.asset._id);
        }
      }
    } else {
      setAssetName("");
      setAssetId("");
      setCategory("");
    }
  };

  // Function to fetch complete asset details if needed
  const fetchAssetDetails = async (assetId) => {
    if (!assetId) return;
    
    const user = JSON.parse(localStorage.getItem("user")); 
    const token = user?.token;

    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch asset details");
      }

      const assetData = await response.json();
      
      // Set category from the complete asset data
      if (assetData.category) {
        setCategory(assetData.category);
      } else if (assetData.type) {
        setCategory(assetData.type);
      } else {
        setCategory(""); // Empty so user can select
      }
      
    } catch (error) {
      console.error("Error fetching asset details:", error);
      setCategory(""); // Default fallback
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch("http://localhost:5000/api/maintenance/report", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}`
        },
        body: JSON.stringify({
          assetName,
          assetId,
          category,
          issueDescription: issue,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to report issue");
      }
      
      setSubmitted(true);
      
      // Reset form fields
      setSelectedAssetId("");
      setAssetName("");
      setAssetId("");
      setCategory("");
      setIssue("");
    } catch (error) {
      console.error("Error reporting issue:", error);
      alert("Failed to report issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent bg-white transition-all duration-300";
  const labelClasses = "block text-sm font-medium mb-1 text-gray-700";
  
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6 mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          backgroundColor: colors.sand, 
          boxShadow: `0 15px 35px rgba(0, 31, 63, 0.15)`,
          borderLeft: `4px solid ${colors.darkBlue}`
        }}
        className="w-full max-w-2xl p-8 rounded-3xl overflow-hidden relative"
      >
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ backgroundColor: colors.lightBlue }}
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{ backgroundColor: colors.mediumBlue }}
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ backgroundColor: colors.darkBlue }}
          className="absolute top-1/3 -left-10 w-20 h-20 rounded-full"
        ></motion.div>
        
        {/* Header */}
        <div className="relative z-10 mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ color: colors.darkBlue }} 
            className="text-3xl font-bold mb-2"
          >
            Report an Issue
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60px" }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ backgroundColor: colors.mediumBlue, height: "3px" }}
            className="mb-3"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ color: colors.mediumBlue }} 
            className="text-sm"
          >
            Please provide the details of the issue you'd like to report
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
              style={{ backgroundColor: colors.mediumBlue }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <motion.h3 
              style={{ color: colors.darkBlue }} 
              className="text-2xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Issue Reported Successfully!
            </motion.h3>
            <motion.p 
              style={{ color: colors.mediumBlue }} 
              className="mb-6 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your maintenance request has been submitted and will be addressed by our team shortly.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubmitted(false)}
              style={{ backgroundColor: colors.mediumBlue, color: 'white' }}
              className="px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Report Another Issue
            </motion.button>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit} 
            className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Select Asset dropdown */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Select Your Asset
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-3">
                  <svg className="animate-spin h-5 w-5" style={{ color: colors.mediumBlue }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : error ? (
                <div className="p-3 text-red-500 bg-red-50 rounded-xl border border-red-100">
                  {error}
                </div>
              ) : (
                <motion.select
                  whileFocus={{ scale: 1.01 }}
                  value={selectedAssetId}
                  onChange={handleAssetSelect}
                  className={`${inputClasses} cursor-pointer`}
                  style={{ borderColor: colors.mediumBlue }}
                  required
                >
                  <option value="">Select an asset</option>
                  {myAssets.map(asset => (
                    <option key={asset._id} value={asset._id}>
                      {asset.asset?.name || "Unnamed Asset"} ({asset.asset?.assetId || `AST-${asset.asset?._id?.slice(-5).toUpperCase() || "N/A"}`})
                    </option>
                  ))}
                </motion.select>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-1">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Asset Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="Asset name (auto-filled)"
                className={inputClasses}
                style={{ borderColor: colors.mediumBlue, backgroundColor: "#f9f9f9" }}
                readOnly
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-1">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Asset ID
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="Asset ID (auto-filled)"
                className={inputClasses}
                style={{ borderColor: colors.mediumBlue, backgroundColor: "#f9f9f9" }}
                readOnly
                required
              />
            </motion.div>
            
            {/* Updated Category Selection */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>Category</label>
              <select
                name="category"
                value={category}
                onChange={handleCategoryChange}
                className={inputClasses}
                style={{ 
                  borderColor: colors.lightBlue,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
                required
              >
              <option value="">Select a category...</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Mobile Devices">Mobile Devices</option>
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="IT & Technology">IT & Technology</option>
              </select>
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Issue Description
              </label>
              <motion.textarea 
                whileFocus={{ scale: 1.01 }}
                value={issue} 
                onChange={(e) => setIssue(e.target.value)}
                className={`${inputClasses} resize-none`}
                style={{ borderColor: colors.mediumBlue }}
                rows="5"
                placeholder="Describe the issue in detail..."
                required
              ></motion.textarea>
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-2 mt-4">
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: colors.mediumBlue }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  backgroundColor: colors.darkBlue,
                  opacity: isSubmitting ? 0.7 : 1
                }}
                className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center"
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
                  'Submit Issue Report'
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default ReportAnIssue;