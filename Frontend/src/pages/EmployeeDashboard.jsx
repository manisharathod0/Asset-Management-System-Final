import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { motion } from "framer-motion";

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    assignedAssets: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user auth token
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  };

  // Fetch assigned assets
  const fetchAssets = async () => {
    const token = getToken();
    
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
      
      // Update dashboard counter
      setDashboardData(prev => ({
        ...prev,
        assignedAssets: data.length
      }));
    } catch (error) {
      console.error("Error fetching assets:", error);
      setError(error.message);
    }
  };

  // Fetch request status
  const fetchRequests = async () => {
    const token = getToken();
    
    if (!token) {
      return; // Already handled in fetchAssets
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/request-asset", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch requests");
      }
      
      const data = await response.json();
      setRequests(data);
      
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
      const response = await fetch("http://localhost:5000/api/activity/recent", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch activity");
      }
      
      const data = await response.json();
      setRecentActivity(data);
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
          fetchRecentActivity()
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
      { name: "Assigned Assets", value: dashboardData.assignedAssets, color: "#3A6D8C" },
      { name: "Pending Requests", value: dashboardData.pendingRequests, color: "#6A9AB0" },
      { name: "Approved Requests", value: dashboardData.approvedRequests, color: "#5C7D8A" },
      { name: "Rejected Requests", value: dashboardData.rejectedRequests, color: "#001F3F" },
    ];
  };

  const chartData = prepareChartData();

  // Loading state UI
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-800">Loading your dashboard...</h2>
          <p className="mt-2 text-gray-600">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-medium text-red-600">Dashboard Error</h2>
          <p className="mt-2 text-gray-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-90vh overflow-y-auto bg-gray-100 pt-24 px-6">
      {/* Dashboard Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-300"
      >
        {/* Welcome Message */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome to Your Employee Dashboard</h1>
          <p className="text-lg mt-2 text-gray-600">
            View your assigned assets, request status, and activity logs.
          </p>
        </div>

        {/* Dashboard Header */}
        <h2 className="text-2xl font-medium mb-6 text-gray-800 text-center">Employee Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chartData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg shadow text-white text-center"
              style={{ backgroundColor: item.color }}
            >
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-2xl font-semibold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-medium mb-3 text-gray-800">Your Asset Overview</h3>
            <div className="w-full h-60 bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" outerRadius={80} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Request Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-medium mb-3 text-gray-800">Request Status</h3>
            <div className="w-full h-60 bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Table */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-medium mb-3 text-gray-800">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#3A6D8C] text-white">
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Action</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <tr key={index} className="text-center">
                      <td className="p-3 border">{new Date(activity.date).toLocaleDateString()}</td>
                      <td className="p-3 border">{new Date(activity.date).toLocaleTimeString()}</td>
                      <td className="p-3 border">{activity.action}</td>
                      <td className="p-3 border">{activity.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="4" className="p-3 border">No recent activity found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;