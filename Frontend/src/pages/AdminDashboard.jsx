

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, Legend,
         LineChart, Line, AreaChart, Area } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  // Fetch dashboard stats from backend
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
    <div className="h-screen w-90vh overflow-y-auto bg-gray-100 pt-24 px-6">
      <div className="max-w-[1200px] mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-300">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome to the Admin Dashboard</h1>
          <p className="text-lg mt-2 text-gray-600">
            Monitor asset management, track usage, and oversee system activities efficiently.
          </p>
        </div>

        <h2 className="text-2xl font-medium mb-6 text-gray-800 text-center">Admin Dashboard</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {stats && stats.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow text-white text-center"
              style={{ backgroundColor: item.color }}
            >
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-gray-800">Asset Distribution</h3>
            <div className="w-full h-60">
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
            <h3 className="text-xl font-medium mb-3 text-gray-800">Asset Category Breakdown</h3>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats || []}>
                  <XAxis dataKey="name" />
                  <YAxis />
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

        {/* Additional charts and recent activity table can be added similarly */}
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-3 text-gray-800">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#3A6D8C] text-white">
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Activity</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((entry, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="p-3 border">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="p-3 border">{new Date(entry.date).toLocaleTimeString()}</td>
                    <td className="p-3 border">{entry.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
