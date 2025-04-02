import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ViewMyAsset = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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
      case 'active': return 'text-green-600';
      case 'under maintenance': return 'text-yellow-600';
      case 'inactive': return 'text-red-600';
      default: return 'text-blue-600';
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
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <h3 className="text-lg font-bold truncate">{asset.asset?.name || "Unnamed Asset"}</h3>
            </div>
            <div className="p-4">
              <div className="mb-3 flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${getStatusColor(asset.asset?.status)}`}>
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-23">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            My Assets
          </motion.h1>
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.4 }}
          ></motion.div>
        </div>

        {/* Main Content */}
        <motion.div 
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Top Section with Stats */}
          <div className="bg-gradient-to-r bg-[#001F3F] text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Asset Management</h2>
                <p className="opacity-80">Track and manage your assigned company assets</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-4 text-center">
                  <span className="block text-3xl font-bold">{assets.length}</span>
                  <span className="text-sm opacity-80">Total Assets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assets</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any assets assigned to you yet.</p>
                  </div>
                ) : (
                  <>
                    {sortedAssets.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No matching assets found</p>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th 
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                            <tbody className="bg-white divide-y divide-gray-200">
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
                                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold">
                                          {(asset.asset?.name?.[0] || "A").toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {asset.asset?.name || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(asset.asset?.status)} bg-green-100`}>
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
                      </>
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