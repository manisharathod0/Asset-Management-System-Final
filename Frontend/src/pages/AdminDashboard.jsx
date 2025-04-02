import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend
} from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  // Define color palette for consistent use
  const colors = {
    darkNavy: "#001F3F",
    primary: "#3A6D8C",
    secondary: "#6A9AB0",
    accent: "#EAD8B1"
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch("http://localhost:5000/api/dashboard/stats");
        const statsData = await statsRes.json();
        setStats([
          { name: "Total Assets", value: statsData.totalAssets, color: colors.darkNavy },
          { name: "Assigned Assets", value: statsData.assignedAssets, color: colors.primary },
          { name: "Pending Requests", value: statsData.pendingRequests, color: colors.secondary },
          { name: "Under Maintenance", value: statsData.underMaintenance, color: colors.accent },
        ]);

        const activityRes = await fetch("http://localhost:5000/api/dashboard/activity");
        const activityData = await activityRes.json();
        setActivity(activityData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 mt-16"
      style={{ background: "linear-gradient(to bottom, #f5f7fa, #e4e7eb)" }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden border-t-4"
        style={{ borderColor: colors.primary }}
      >
        <div className="p-6 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold" style={{ color: colors.darkNavy }}>
              Admin Dashboard
            </h1>
            <div className="w-20 h-1 mx-auto my-3 rounded" style={{ backgroundColor: colors.accent }}></div>
            <p className="text-lg text-gray-600">
              Manage assets, track usage, and oversee system activities efficiently.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {stats && stats.map((item, index) => (
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
          </div>

          {/* Charts Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-4 border-b" style={{ backgroundColor: colors.accent, borderColor: colors.primary }}>
                <h3 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>Asset Distribution</h3>
              </div>
              <div className="p-6 bg-white">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={stats || []} 
                        dataKey="value" 
                        outerRadius={80} 
                        label 
                        animationDuration={1000}
                      >
                        {(stats || []).map((entry, index) => (
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

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-4 border-b" style={{ backgroundColor: colors.accent, borderColor: colors.primary }}>
                <h3 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>Asset Category Breakdown</h3>
              </div>
              <div className="p-6 bg-white">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats || []}>
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
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {(stats || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
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
                    <th className="p-4">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((entry, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                      style={{ backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "#ffffff" }}
                    >
                      <td className="p-4">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="p-4">{new Date(entry.date).toLocaleTimeString()}</td>
                      <td className="p-4">{entry.action}</td>
                    </tr>
                  ))}
                  {activity.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">No recent activity</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;