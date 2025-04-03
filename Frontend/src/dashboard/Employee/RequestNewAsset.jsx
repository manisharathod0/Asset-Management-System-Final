import { useState } from "react";
import { motion } from "framer-motion";

const RequestNewAsset = () => {
  const [formData, setFormData] = useState({
    assetId: "",
    assetName: "",
    category: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Color palette
  const colors = {
    darkBlue: "#001F3F",
    mediumBlue: "#3A6D8C",
    lightBlue: "#6A9AB0",
    sand: "#EAD8B1"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/request-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        assetName: "",
        category: "",
        reason: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
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
            Request New Asset
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
            Please provide the details of the asset you'd like to request
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
              Asset Request Submitted Successfully!
            </motion.h3>
            <motion.p 
              style={{ color: colors.mediumBlue }} 
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
              style={{ backgroundColor: colors.mediumBlue, color: 'white' }}
              className="px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Request Another Asset
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
            <motion.div variants={itemVariants} className="md:col-span-1">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Asset ID
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="assetId"
                value={formData.assetId}
                onChange={handleChange}
                placeholder="Enter asset ID"
                className={inputClasses}
                style={{ borderColor: colors.mediumBlue }}
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-1">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Asset Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                placeholder="Enter asset name"
                className={inputClasses}
                style={{ borderColor: colors.mediumBlue }}
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Category
              </label>
              <motion.select
                whileFocus={{ scale: 1.01 }}
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputClasses} cursor-pointer`}
                style={{ borderColor: colors.mediumBlue }}
                required
              >
                <option value="">Select a category</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Other">Other</option>
              </motion.select>
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label className={labelClasses} style={{ color: colors.darkBlue }}>
                Reason for Request
              </label>
              <motion.textarea 
                whileFocus={{ scale: 1.01 }}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={`${inputClasses} resize-none`}
                style={{ borderColor: colors.mediumBlue }}
                rows="5"
                placeholder="Explain why you need this asset"
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
                  'Submit Request'
                )}
              </motion.button>
            </motion.div>
            
            {error && (
              <motion.div 
                variants={itemVariants}
                className="md:col-span-2"
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