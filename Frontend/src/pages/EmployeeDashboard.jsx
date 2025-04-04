

import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend
} from "recharts";
import { motion } from "framer-motion";

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    assignedAssets: 0,
    totalAssetQuantity: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define color palette for consistent use - using admin colors
  const colors = {
    darkNavy: "#001F3F",
    primary: "#3A6D8C",
    secondary: "#6A9AB0",
    accent: "#EAD8B1"
  };

  // Get user auth token
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  };

  // Fetch assigned assets - updated to include quantity
  const fetchAssets = async () => {
    const token = getToken();
    
    if (!token) {
      setError("Authentication token not found. Please login.");
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assign/my-assets`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch assets");
      }
      
      const data = await response.json();
      
      // Calculate total quantity of assigned assets
      const totalQuantity = data.reduce((sum, asset) => sum + (asset.quantity || 1), 0);
      
      // Update dashboard counter
      setDashboardData(prev => ({
        ...prev,
        assignedAssets: data.length,
        totalAssetQuantity: totalQuantity
      }));
    } catch (error) {
      console.error("Error fetching assets:", error);
      setError(error.message);
    }
  };

  // Fetch category data - new function
  const fetchCategoryData = async () => {
    const token = getToken();
    
    if (!token) {
      return; // Already handled in fetchAssets
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/categories`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch category data");
      }
      
      const data = await response.json();
      setCategoryData(data);
    } catch (error) {
      console.error("Error fetching category data:", error);
      // Not setting error here to avoid blocking the dashboard if only this fails
    }
  };

  // Fetch request status
  const fetchRequests = async () => {
    const token = getToken();
    
    if (!token) {
      return; // Already handled in fetchAssets
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/request-asset`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch requests");
      }
      
      const data = await response.json();
      
      // Count requests by status for dashboard
      const pendingCount = data.filter(req => req.status === "Pending").length;
      const approvedCount = data.filter(req => req.status === "Approved").length;
      const rejectedCount = data.filter(req => req.status === "Rejected").length;
      
      setDashboardData(prev => ({
        ...prev,
        pendingRequests: pendingCount,
        approvedRequests: approvedCount,
        rejectedRequests: rejectedCount
      }));
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message);
    }
  };

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    const token = getToken();
    
    if (!token) {
      return; // Already handled in fetchAssets
    }
    
    try {
      // Update the endpoint to match your backend route
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assetrequests`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch activity");
      }
      
      const data = await response.json();
      
      // Transform the data to match your activity format if needed
      const formattedActivity = data.map(request => ({
        date: request.date, // assuming this is a date string from your backend
        action: `Requested ${request.assetName} (${request.category})`,
        status: request.status,
        reason: request.reason,
        quantity: request.quantity || 1
      }));
      
      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error("Error fetching activity:", error);
      // Not setting error here to avoid blocking the dashboard if only this fails
    }
  };

  // Load all data when component mounts
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchAssets(),
          fetchRequests(),
          fetchRecentActivity(),
          fetchCategoryData()
        ]);
      } catch (error) {
        console.error("Dashboard loading error:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboard();
  }, []);

  // Prepare chart data
  const prepareChartData = () => {
    return [
      { name: "Assets", value: dashboardData.assignedAssets, color: colors.darkNavy },
      { name: "Pending", value: dashboardData.pendingRequests, color: colors.primary },
      { name: "Approved", value: dashboardData.approvedRequests, color: colors.secondary },
      { name: "Rejected", value: dashboardData.rejectedRequests, color: colors.accent },
    ];
  };

  // Prepare category chart data
  const prepareCategoryData = () => {
    return categoryData.map((category, index) => {
      // Create a color palette based on the number of categories
      const categoryColors = [
        colors.darkNavy, 
        colors.primary, 
        colors.secondary, 
        colors.accent,
        "#5D8CAE", "#83A9C9", "#B3CDE0", "#CCEBC5", "#A8DDB5"
      ];
      
      return {
        name: category.category,
        count: category.count,
        quantity: category.totalQuantity,
        color: categoryColors[index % categoryColors.length]
      };
    });
  };

  const chartData = prepareChartData();
  const categoryChartData = prepareCategoryData();

  // Status badge component for consistent styling
  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch(status) {
        case "Completed": return { bg: colors.primary, text: "#ffffff" };
        case "Pending": return { bg: colors.secondary, text: "#ffffff" };
        case "Approved": return { bg: colors.accent, text: colors.darkNavy };
        case "Rejected": return { bg: colors.darkNavy, text: "#ffffff" };
        default: return { bg: "#f5f5f5", text: colors.darkNavy };
      }
    };
    
    const { bg, text } = getStatusColor();
    
    return (
      <span 
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{ backgroundColor: bg, color: text }}
      >
        {status}
      </span>
    );
  };

  // Loading state UI - using admin style
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(to bottom, #f5f7fa, #e4e7eb)" }}>
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center border-t-4" style={{ borderColor: colors.primary }}>
          <h2 className="text-2xl font-semibold" style={{ color: colors.darkNavy }}>Loading Dashboard</h2>
          <div className="w-20 h-1 mx-auto my-3 rounded" style={{ backgroundColor: colors.accent }}></div>
          <p style={{ color: colors.primary }}>Fetching your asset management data...</p>
          <div className="mt-6 flex justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" 
                 style={{ borderColor: `${colors.secondary} transparent ${colors.secondary} transparent` }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI - using admin style
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(to bottom, #f5f7fa, #e4e7eb)" }}>
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center border-t-4 border-red-500">
          <h2 className="text-2xl font-semibold" style={{ color: colors.darkNavy }}>Dashboard Error</h2>
          <div className="w-20 h-1 mx-auto my-3 rounded bg-red-200"></div>
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-6 px-6 py-2 text-white rounded-lg shadow-md hover:shadow-lg"
            onClick={() => window.location.reload()}
            style={{ backgroundColor: colors.primary }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-10 px-4 mt-16"
      style={{ background: "linear-gradient(to bottom, #f5f7fa, #e4e7eb)" }}
    >
      {/* Main Container - using admin styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden border-t-4"
        style={{ borderColor: colors.primary }}
      >
        <div className="p-6 bg-white">
          {/* Header - matching admin style */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold" style={{ color: colors.darkNavy }}>
              Employee Dashboard
            </h1>
            <div className="w-20 h-1 mx-auto my-3 rounded" style={{ backgroundColor: colors.accent }}></div>
            <p className="text-lg text-gray-600">
              Asset Management System
            </p>
          </div>

          {/* Stats Grid - updated to include quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-6">
            {/* Original stats */}
            {chartData.map((item, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.04, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 rounded-xl text-white text-center shadow-lg relative overflow-hidden"
                style={{ backgroundColor: item.color }}
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -translate-y-6 translate-x-6"></div>
                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                <p className="text-3xl font-bold">{item.value}</p>
              </motion.div>
            ))}
            
            {/* New Total Quantity Card */}
            <motion.div 
              whileHover={{ scale: 1.04, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 rounded-xl text-white text-center shadow-lg relative overflow-hidden"
              style={{ backgroundColor: "#4A90E2" }}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -translate-y-6 translate-x-6"></div>
              <h3 className="text-lg font-semibold mb-1">Quantity</h3>
              <p className="text-3xl font-bold">{dashboardData.totalAssetQuantity}</p>
            </motion.div>
          </div>

          {/* Charts Section - updated with category data */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Asset Distribution Chart */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-4 border-b" style={{ backgroundColor: colors.accent, borderColor: colors.primary }}>
                <h3 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>Asset Overview</h3>
              </div>
              <div className="p-6 bg-white">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={chartData} 
                        dataKey="value" 
                        outerRadius={80} 
                        label
                        animationDuration={1000}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '4px', 
                          backgroundColor: "#fff",
                          borderColor: colors.secondary
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Category Chart - New chart replacing Request Status chart */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-4 border-b" style={{ backgroundColor: colors.accent, borderColor: colors.primary }}>
                <h3 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>Category Breakdown</h3>
              </div>
              <div className="p-6 bg-white">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <XAxis dataKey="name" tick={{ fill: colors.darkNavy }} />
                      <YAxis tick={{ fill: colors.darkNavy }} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '4px', 
                          backgroundColor: "#fff",
                          borderColor: colors.secondary
                        }}
                      />
                      <Legend />
                      <Bar name="Category Count" dataKey="count" radius={[4, 4, 0, 0]}>
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                      <Bar name="Total Quantity" dataKey="quantity" radius={[4, 4, 0, 0]} fill={colors.accent} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity Table - updated to include quantity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-4 border-b" style={{ backgroundColor: colors.accent, borderColor: colors.primary }}>
              <h3 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>Recent Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.primary }} className="text-white text-left">
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((activity, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                        style={{ backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "#ffffff" }}
                      >
                        <td className="p-4">{new Date(activity.date).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="p-4">{activity.action}</td>
                        <td className="p-4">{activity.quantity || 1}</td>
                        <td className="p-4">
                          <StatusBadge status={activity.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">No recent activity found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* View more link - styled to match admin design */}
            <div className="p-4 text-right border-t" style={{ borderColor: "#f0f0f0" }}>
              <button className="text-sm font-medium hover:underline" style={{ color: colors.primary }}>
                View All Activity
              </button>
            </div>
          </motion.div>
          
          {/* Footer */}
          <div className="mt-8 py-4 border-t text-center" style={{ borderColor: "#f0f0f0" }}>
            <p className="text-sm text-gray-500">
              © 2025 Asset Management System • Last updated: Apr 3, 2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;