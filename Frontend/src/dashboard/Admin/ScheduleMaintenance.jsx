// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const ScheduledMaintenance = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         assetId: "",
//         assetName: "",
//         date: "",
//         technician: "",
//         task: "",
//         status: "scheduled",
//     });
//     const [assets, setAssets] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [assetsLoading, setAssetsLoading] = useState(false);

//     useEffect(() => {
//         const fetchAssets = async () => {
//             setAssetsLoading(true);
//             try {
//                 const response = await axios.get("http://localhost:5000/api/maintenance/pending");
//                 console.log("Fetched assets:", response.data); // Debugging log
//                 setAssets(response.data);
//             } catch (err) {
//                 console.error("Error fetching assets", err);
//                 setError("Failed to fetch assets.");
//             } finally {
//                 setAssetsLoading(false);
//             }
//         };
//         fetchAssets();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "asset") {
//             const selectedAsset = assets.find((asset) => asset._id === value);
//             setFormData({
//                 ...formData,
//                 assetId: selectedAsset._id,
//                 assetName: selectedAsset.assetName,
//             });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
    
//         if (!formData.assetId || !formData.date || !formData.technician || !formData.task) {
//             setError("All fields are required.");
//             setLoading(false);
//             return;
//         }
    
//         try {
//             console.log("Data being sent:", formData);
//             const response = await axios.post(
//                 "http://localhost:5000/api/maintenance/scheduled-maintenance",
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             console.log("Server Response:", response.data);
    
//             const confirmed = window.confirm("Asset scheduled successfully. Do you want to proceed?");
    
//             if (confirmed) {
//                 navigate("/admin/request-repair");
//             }
    
//         } catch (err) {
//             setError("Failed to schedule maintenance.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6 mt-5">
//             <div className="max-w-lg w-full bg-white bg-opacity-90 backdrop-blur-md p-8 shadow-xl rounded-xl border border-gray-300">
//                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Schedule Maintenance</h2>

//                 {error && <p className="text-red-500 font-medium text-center mb-4">{error}</p>}

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Asset Selection */}
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-1">Asset ID & Name</label>
//                         <select
//                             name="asset"
//                             value={formData.assetId}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
//                         >
//                             <option value="">Select an Asset</option>
//                             {assetsLoading ? (
//                                 <option disabled>Loading...</option>
//                             ) : (
//                                 assets.map((asset) => (
//                                     <option key={asset._id} value={asset._id}>
//                                         {asset._id} - {asset.assetName}
//                                     </option>
//                                 ))
//                             )}
//                         </select>
//                     </div>

//                     {/* Date Input */}
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-1">Maintenance Date</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={formData.date}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
//                         />
//                     </div>

//                     {/* Technician Name */}
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-1">Technician Name</label>
//                         <input
//                             type="text"
//                             name="technician"
//                             value={formData.technician}
//                             onChange={handleChange}
//                             placeholder="Enter technician name"
//                             className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-1">Description</label>
//                         <textarea
//                             name="task"
//                             value={formData.task}
//                             onChange={handleChange}
//                             placeholder="Describe the maintenance task"
//                             className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         className={`w-full py-3 rounded-lg text-white font-semibold transition ${
//                             loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#001F3F] hover:bg-blue-600 shadow-md"
//                         }`}
//                         disabled={loading || !formData.assetId || !formData.date}
//                     >
//                         {loading ? "Scheduling..." : "Schedule Maintenance"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ScheduledMaintenance;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const ScheduledMaintenance = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        assetId: "",
        assetName: "",
        date: "",
        technician: "",
        task: "",
        status: "scheduled",
    });
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assetsLoading, setAssetsLoading] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            setAssetsLoading(true);
            try {
                const response = await axios.get("http://localhost:5000/api/maintenance/pending");
                console.log("Fetched assets:", response.data);
                setAssets(response.data);
            } catch (err) {
                console.error("Error fetching assets", err);
                setError("Failed to fetch assets.");
            } finally {
                setAssetsLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "asset") {
            const selectedAsset = assets.find((asset) => asset._id === value);
            setFormData({
                ...formData,
                assetId: selectedAsset._id,
                assetName: selectedAsset.assetName,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        if (!formData.assetId || !formData.date || !formData.technician || !formData.task) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }
    
        try {
            console.log("Data being sent:", formData);
            const response = await axios.post(
                "http://localhost:5000/api/maintenance/scheduled-maintenance",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Server Response:", response.data);
    
            const confirmed = window.confirm("Asset scheduled successfully. Do you want to proceed?");
    
            if (confirmed) {
                navigate("/admin/request-repair");
            }
    
        } catch (err) {
            setError("Failed to schedule maintenance.");
        } finally {
            setLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.8 
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 31, 63, 0.3)" },
        tap: { scale: 0.95 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EAD8B1] to-[#6A9AB0] flex items-center justify-center p-6 mt-20">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-lg w-full bg-white bg-opacity-95 backdrop-blur-md p-8 shadow-xl rounded-3xl border border-[#3A6D8C]/20"
            >
                <motion.div 
                    className="mb-8 text-center"
                    variants={itemVariants}
                >
                    <h2 className="text-3xl font-bold text-[#001F3F] mb-2">Schedule Maintenance</h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-[#001F3F] to-[#3A6D8C] rounded-full mx-auto"></div>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg"
                    >
                        <p className="text-red-500 font-medium">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Asset Selection */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-[#001F3F] font-semibold mb-2">Asset ID & Name</label>
                        <select
                            name="asset"
                            value={formData.assetId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#EAD8B1]/10 border border-[#6A9AB0]/30 rounded-xl focus:ring-2 focus:ring-[#3A6D8C]/50 focus:border-[#3A6D8C] transition-all duration-300 outline-none text-[#001F3F]"
                        >
                            <option value="">Select an Asset</option>
                            {assetsLoading ? (
                                <option disabled>Loading...</option>
                            ) : (
                                assets.map((asset) => (
                                    <option key={asset._id} value={asset._id}>
                                        {asset._id} - {asset.assetName}
                                    </option>
                                ))
                            )}
                        </select>
                    </motion.div>

                    {/* Date Input */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-[#001F3F] font-semibold mb-2">Maintenance Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#EAD8B1]/10 border border-[#6A9AB0]/30 rounded-xl focus:ring-2 focus:ring-[#3A6D8C]/50 focus:border-[#3A6D8C] transition-all duration-300 outline-none text-[#001F3F]"
                        />
                    </motion.div>

                    {/* Technician Name */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-[#001F3F] font-semibold mb-2">Technician Name</label>
                        <input
                            type="text"
                            name="technician"
                            value={formData.technician}
                            onChange={handleChange}
                            placeholder="Enter technician name"
                            className="w-full px-4 py-3 bg-[#EAD8B1]/10 border border-[#6A9AB0]/30 rounded-xl focus:ring-2 focus:ring-[#3A6D8C]/50 focus:border-[#3A6D8C] transition-all duration-300 outline-none text-[#001F3F]"
                        />
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-[#001F3F] font-semibold mb-2">Description</label>
                        <textarea
                            name="task"
                            value={formData.task}
                            onChange={handleChange}
                            placeholder="Describe the maintenance task"
                            rows="4"
                            className="w-full px-4 py-3 bg-[#EAD8B1]/10 border border-[#6A9AB0]/30 rounded-xl focus:ring-2 focus:ring-[#3A6D8C]/50 focus:border-[#3A6D8C] transition-all duration-300 outline-none text-[#001F3F]"
                        />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants}>
                        <motion.button
                            type="submit"
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                            disabled={loading || !formData.assetId || !formData.date}
                            className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 ${
                                loading || !formData.assetId || !formData.date
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#001F3F] to-[#3A6D8C] hover:shadow-lg"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Scheduling...
                                </span>
                            ) : (
                                "Schedule Maintenance"
                            )}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default ScheduledMaintenance;