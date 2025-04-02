// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const ViewMyAsset = () => {
//   const [assets, setAssets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [viewMode, setViewMode] = useState("grid"); // grid or table view

//   // Color palette
//   const colors = {
//     darkNavy: "#001F3F",
//     oceanBlue: "#3A6D8C",
//     skyBlue: "#6A9AB0",
//     sand: "#EAD8B1"
//   };

//   const fetchAssets = async () => {
//     const user = JSON.parse(localStorage.getItem("user")); 
//     const token = user?.token;

//     if (!token) {
//       setError("Authentication token not found. Please login.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/assign/my-assets", {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch assets");
//       }

//       const data = await response.json();
//       setAssets(data);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAssets(); }, []);

//   // Sorting logic
//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'active': return 'text-green-600 bg-green-100';
//       case 'under maintenance': return 'text-yellow-600 bg-yellow-100';
//       case 'inactive': return 'text-red-600 bg-red-100';
//       default: return 'text-blue-600 bg-blue-100';
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { 
//         year: 'numeric', 
//         month: 'short', 
//         day: 'numeric' 
//       });
//     } catch (e) {
//       return "Invalid Date";
//     }
//   };

//   // Filter assets by search term
//   const filteredAssets = assets.filter(asset => 
//     asset.asset?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     asset.asset?.status?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Sort assets
//   const sortedAssets = [...filteredAssets].sort((a, b) => {
//     if (!sortConfig.key) return 0;
    
//     let aValue, bValue;
    
//     if (sortConfig.key === 'name') {
//       aValue = a.asset?.name || '';
//       bValue = b.asset?.name || '';
//     } else if (sortConfig.key === 'status') {
//       aValue = a.asset?.status || '';
//       bValue = b.asset?.status || '';
//     } else if (sortConfig.key === 'assignedDate' || sortConfig.key === 'dueDate') {
//       aValue = new Date(a[sortConfig.key]);
//       bValue = new Date(b[sortConfig.key]);
//     }
    
//     if (sortConfig.direction === 'ascending') {
//       return aValue > bValue ? 1 : -1;
//     } else {
//       return aValue < bValue ? 1 : -1;
//     }
//   });

//   // Card layout for assets
//   const renderAssetCards = () => {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {sortedAssets.map((asset, index) => (
//           <motion.div 
//             key={asset._id || index} 
//             className="rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl border border-gray-100"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             style={{ backgroundColor: colors.sand }}
//           >
//             <div className="p-4 text-white" style={{ backgroundColor: colors.darkNavy }}>
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.skyBlue }}>
//                   <span className="font-bold text-white">
//                     {(asset.asset?.name?.[0] || "A").toUpperCase()}
//                   </span>
//                 </div>
//                 <h3 className="text-lg font-bold truncate">{asset.asset?.name || "Unnamed Asset"}</h3>
//               </div>
//             </div>
//             <div className="p-5">
//               <div className="mb-3 flex justify-between items-center">
//                 <span className="text-gray-600">Status:</span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(asset.asset?.status)}`}>
//                   {asset.asset?.status || "Unknown"}
//                 </span>
//               </div>
//               <div className="mb-3 flex justify-between">
//                 <span className="text-gray-600">Assigned:</span>
//                 <span className="font-medium">{formatDate(asset.assignedDate)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Due Date:</span>
//                 <span className="font-medium">{formatDate(asset.dueDate)}</span>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-2" style={{ backgroundColor: colors.skyBlue + "40" }}>
//       <motion.div 
//         className="max-w-5xl mx-auto"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Header */}
//         <motion.div 
//           className="text-center mb-10"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h1 className="text-4xl font-bold mb-2" style={{ color: colors.darkNavy }}>My Assets</h1>
//           <motion.div 
//             className="h-1 w-24 mx-auto rounded"
//             style={{ backgroundColor: colors.oceanBlue }}
//             initial={{ width: 0 }}
//             animate={{ width: 96 }}
//             transition={{ delay: 0.4 }}
//           ></motion.div>
//         </motion.div>

//         {/* Main Content */}
//         <motion.div 
//           className="rounded-2xl overflow-hidden shadow-xl"
//           style={{ backgroundColor: "white" }}
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           {/* Top Section */}
//           <div className="p-6 text-white" style={{ backgroundColor: colors.darkNavy }}>
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-bold mb-2">Asset Management</h2>
//                 <p className="opacity-80">Track and manage your assigned company assets</p>
//               </div>
//               <div className="mt-4 md:mt-0 px-4 py-3 rounded-xl" style={{ backgroundColor: colors.oceanBlue }}>
//                 <span className="block text-3xl font-bold text-center">{assets.length}</span>
//                 <span className="text-sm opacity-80">Total Assets</span>
//               </div>
//             </div>
//           </div>

//           {/* Search and View Toggle */}
//           <div className="p-6 border-b" style={{ borderColor: colors.sand, backgroundColor: colors.sand + "40" }}>
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               <div className="relative w-full md:w-64">
//                 <input
//                   type="text"
//                   placeholder="Search assets..."
//                   className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2"
//                   style={{ borderColor: colors.oceanBlue, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5" style={{ color: colors.oceanBlue }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button 
//                   onClick={() => setViewMode("grid")} 
//                   className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "text-white" : "text-white opacity-60"}`}
//                   style={{ backgroundColor: viewMode === "grid" ? colors.oceanBlue : colors.darkNavy }}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                   </svg>
//                 </button>
//                 <button 
//                   onClick={() => setViewMode("table")} 
//                   className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "text-white" : "text-white opacity-60"}`}
//                   style={{ backgroundColor: viewMode === "table" ? colors.oceanBlue : colors.darkNavy }}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="p-6">
//             {loading && (
//               <div className="flex justify-center items-center py-10">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.oceanBlue }}></div>
//               </div>
//             )}

//             {error && (
//               <div className="border-l-4 p-4 mb-6 rounded-lg" style={{ backgroundColor: "#FEEEF0", borderColor: "#FF4D6D" }}>
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {!loading && !error && (
//               <>
//                 {assets.length === 0 ? (
//                   <div className="text-center py-12">
//                     <svg className="mx-auto h-12 w-12" style={{ color: colors.oceanBlue }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                     </svg>
//                     <h3 className="mt-2 text-sm font-medium" style={{ color: colors.darkNavy }}>No assets</h3>
//                     <p className="mt-1 text-sm text-gray-500">You don't have any assets assigned to you yet.</p>
//                   </div>
//                 ) : (
//                   <>
//                     {sortedAssets.length === 0 ? (
//                       <p className="text-center text-gray-500 py-4">No matching assets found</p>
//                     ) : viewMode === "grid" ? (
//                       renderAssetCards()
//                     ) : (
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y" style={{ borderColor: colors.sand }}>
//                           <thead style={{ backgroundColor: colors.sand + "40" }}>
//                             <tr>
//                               <th 
//                                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer rounded-tl-lg"
//                                 style={{ color: colors.darkNavy }}
//                                 onClick={() => requestSort('name')}
//                               >
//                                 <div className="flex items-center">
//                                   Asset Name
//                                   {sortConfig.key === 'name' && (
//                                     <span className="ml-1">
//                                       {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//                                     </span>
//                                   )}
//                                 </div>
//                               </th>
//                               <th 
//                                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
//                                 style={{ color: colors.darkNavy }}
//                                 onClick={() => requestSort('status')}
//                               >
//                                 <div className="flex items-center">
//                                   Status
//                                   {sortConfig.key === 'status' && (
//                                     <span className="ml-1">
//                                       {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//                                     </span>
//                                   )}
//                                 </div>
//                               </th>
//                               <th 
//                                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
//                                 style={{ color: colors.darkNavy }}
//                                 onClick={() => requestSort('assignedDate')}
//                               >
//                                 <div className="flex items-center">
//                                   Assigned Date
//                                   {sortConfig.key === 'assignedDate' && (
//                                     <span className="ml-1">
//                                       {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//                                     </span>
//                                   )}
//                                 </div>
//                               </th>
//                               <th 
//                                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer rounded-tr-lg"
//                                 style={{ color: colors.darkNavy }}
//                                 onClick={() => requestSort('dueDate')}
//                               >
//                                 <div className="flex items-center">
//                                   Due Date
//                                   {sortConfig.key === 'dueDate' && (
//                                     <span className="ml-1">
//                                       {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//                                     </span>
//                                   )}
//                                 </div>
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y" style={{ borderColor: colors.sand }}>
//                             {sortedAssets.map((asset, index) => (
//                               <motion.tr 
//                                 key={asset._id || index}
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: index * 0.05 }}
//                                 className="hover:bg-gray-50"
//                               >
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="flex items-center">
//                                     <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.skyBlue }}>
//                                       <span className="text-white font-bold">
//                                         {(asset.asset?.name?.[0] || "A").toUpperCase()}
//                                       </span>
//                                     </div>
//                                     <div className="ml-4">
//                                       <div className="text-sm font-medium" style={{ color: colors.darkNavy }}>
//                                         {asset.asset?.name || "N/A"}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(asset.asset?.status)}`}>
//                                     {asset.asset?.status || "N/A"}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                   {formatDate(asset.assignedDate)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                   {formatDate(asset.dueDate)}
//                                 </td>
//                               </motion.tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default ViewMyAsset;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ViewMyAsset = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [viewMode, setViewMode] = useState("grid"); // grid or table view

  // Color palette
  const colors = {
    darkNavy: "#001F3F",
    oceanBlue: "#3A6D8C",
    skyBlue: "#6A9AB0",
    sand: "#EAD8B1"
  };

  const fetchAssets = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
    const token = user?.token;

    if (!token) {
      setError("Authentication token not found. Please login.");
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
      setAssets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'under maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Filter assets by search term
  const filteredAssets = assets.filter(asset => 
    asset.asset?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue, bValue;
    
    if (sortConfig.key === 'name') {
      aValue = a.asset?.name || '';
      bValue = b.asset?.name || '';
    } else if (sortConfig.key === 'status') {
      aValue = a.asset?.status || '';
      bValue = b.asset?.status || '';
    } else if (sortConfig.key === 'assignedDate' || sortConfig.key === 'dueDate') {
      aValue = new Date(a[sortConfig.key]);
      bValue = new Date(b[sortConfig.key]);
    }
    
    if (sortConfig.direction === 'ascending') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Card layout for assets
  const renderAssetCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {sortedAssets.map((asset, index) => (
          <motion.div 
            key={asset._id || index} 
            className="rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ backgroundColor: colors.sand }}
          >
            <div className="p-4 text-white" style={{ backgroundColor: colors.darkNavy }}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.skyBlue }}>
                  <span className="font-bold text-white">
                    {(asset.asset?.name?.[0] || "A").toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold truncate">{asset.asset?.name || "Unnamed Asset"}</h3>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3 flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(asset.asset?.status)}`}>
                  {asset.asset?.status || "Unknown"}
                </span>
              </div>
              <div className="mb-3 flex justify-between">
                <span className="text-gray-600">Assigned:</span>
                <span className="font-medium">{formatDate(asset.assignedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">{formatDate(asset.dueDate)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-13" style={{ backgroundColor: colors.skyBlue + "40" }}>
      <motion.div 
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.darkNavy }}>My Assets</h1>
          <motion.div 
            className="h-1 w-24 mx-auto rounded"
            style={{ backgroundColor: colors.oceanBlue }}
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.4 }}
          ></motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="rounded-2xl overflow-hidden shadow-xl"
          style={{ backgroundColor: "white" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Top Section */}
          <div className="p-6 text-white" style={{ backgroundColor: colors.darkNavy }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Asset Management</h2>
                <p className="opacity-80">Track and manage your assigned company assets</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-3 rounded-xl" style={{ backgroundColor: colors.oceanBlue }}>
                <span className="block text-3xl font-bold text-center">{assets.length}</span>
                <span className="text-sm opacity-80">Total Assets</span>
              </div>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="p-6 border-b" style={{ borderColor: colors.sand, backgroundColor: colors.sand + "40" }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.oceanBlue, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: colors.oceanBlue }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode("grid")} 
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "text-white" : "text-white opacity-60"}`}
                  style={{ backgroundColor: viewMode === "grid" ? colors.oceanBlue : colors.darkNavy }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode("table")} 
                  className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "text-white" : "text-white opacity-60"}`}
                  style={{ backgroundColor: viewMode === "table" ? colors.oceanBlue : colors.darkNavy }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.oceanBlue }}></div>
              </div>
            )}

            {error && (
              <div className="border-l-4 p-4 mb-6 rounded-lg" style={{ backgroundColor: "#FEEEF0", borderColor: "#FF4D6D" }}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                {assets.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12" style={{ color: colors.oceanBlue }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium" style={{ color: colors.darkNavy }}>No assets</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any assets assigned to you yet.</p>
                  </div>
                ) : (
                  <>
                    {sortedAssets.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No matching assets found</p>
                    ) : viewMode === "grid" ? (
                      renderAssetCards()
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y" style={{ borderColor: colors.sand }}>
                          <thead style={{ backgroundColor: colors.sand + "40" }}>
                            <tr>
                              <th 
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer rounded-tl-lg"
                                style={{ color: colors.darkNavy }}
                                onClick={() => requestSort('name')}
                              >
                                <div className="flex items-center">
                                  Asset Name
                                  {sortConfig.key === 'name' && (
                                    <span className="ml-1">
                                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th 
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                style={{ color: colors.darkNavy }}
                                onClick={() => requestSort('status')}
                              >
                                <div className="flex items-center">
                                  Status
                                  {sortConfig.key === 'status' && (
                                    <span className="ml-1">
                                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th 
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                style={{ color: colors.darkNavy }}
                                onClick={() => requestSort('assignedDate')}
                              >
                                <div className="flex items-center">
                                  Assigned Date
                                  {sortConfig.key === 'assignedDate' && (
                                    <span className="ml-1">
                                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th 
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer rounded-tr-lg"
                                style={{ color: colors.darkNavy }}
                                onClick={() => requestSort('dueDate')}
                              >
                                <div className="flex items-center">
                                  Due Date
                                  {sortConfig.key === 'dueDate' && (
                                    <span className="ml-1">
                                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y" style={{ borderColor: colors.sand }}>
                            {sortedAssets.map((asset, index) => (
                              <motion.tr 
                                key={asset._id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.skyBlue }}>
                                      <span className="text-white font-bold">
                                        {(asset.asset?.name?.[0] || "A").toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium" style={{ color: colors.darkNavy }}>
                                        {asset.asset?.name || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(asset.asset?.status)}`}>
                                    {asset.asset?.status || "N/A"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(asset.assignedDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(asset.dueDate)}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewMyAsset;