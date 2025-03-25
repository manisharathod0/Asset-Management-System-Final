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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch("http://localhost:5000/api/dashboard/stats");
        const statsData = await statsRes.json();
        setStats([
          { name: "Total Assets", value: statsData.totalAssets, color: "#3A6D8C" },
          { name: "Assigned Assets", value: statsData.assignedAssets, color: "#6A9AB0" },
          { name: "Pending Requests", value: statsData.pendingRequests, color: "#5C7D8A" },
          { name: "Under Maintenance", value: statsData.underMaintenance, color: "#001F3F" },
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 mt-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        className="w-full max-w-6xl bg-white shadow-xl rounded-lg p-8 border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-lg mt-2 text-gray-600">
            Manage assets, track usage, and oversee system activities efficiently.
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {stats && stats.map((item, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl text-white text-center shadow-lg"
              style={{ backgroundColor: item.color }}>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-3xl font-bold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Asset Distribution</h3>
            <div className="w-full h-64 bg-gray-100 rounded-lg p-4 shadow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats || []} dataKey="value" outerRadius={80} label>
                    {(stats || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Asset Category Breakdown</h3>
            <div className="w-full h-64 bg-gray-100 rounded-lg p-4 shadow">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats || []}>
                  <XAxis dataKey="name" tick={{ fill: '#333' }} />
                  <YAxis tick={{ fill: '#333' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {(stats || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#3A6D8C] text-white text-left">
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Activity</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((entry, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(entry.date).toLocaleTimeString()}</td>
                    <td className="p-3">{entry.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
