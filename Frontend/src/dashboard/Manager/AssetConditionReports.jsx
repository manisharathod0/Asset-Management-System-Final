import { useState } from "react";

const AssetConditionReports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      assetName: "Laptop",
      assetType: "Electronics",
      assignedTo: "John Doe",
      department: "IT",
      condition: "Good",
      lastChecked: "2025-02-20",
    },
    {
      id: 2,
      assetName: "Office Chair",
      assetType: "Furniture",
      assignedTo: "Jane Smith",
      department: "HR",
      condition: "Slightly Worn",
      lastChecked: "2025-02-18",
    },
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-6">
      <div className="max-w-5xl w-full p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Asset Condition Reports
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#3A6D8C] text-white text-left">
                <th className="p-3">Asset Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Department</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={report.id}
                  className={`border-b border-gray-300 text-left ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3">{report.assetName}</td>
                  <td className="p-3">{report.assetType}</td>
                  <td className="p-3">{report.assignedTo}</td>
                  <td className="p-3">{report.department}</td>
                  <td className="p-3">{report.condition}</td>
                  <td className="p-3 text-[#6A9AB0] font-semibold">{report.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetConditionReports;
