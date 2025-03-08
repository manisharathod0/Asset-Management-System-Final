import { useState } from "react";

const ViewAssignedAssets = () => {
  const [assignedAssets] = useState([
    {
      id: 1,
      assetName: "Dell Laptop",
      assetType: "Electronics",
      assignedTo: "John Doe",
      department: "IT",
      assignedDate: "2025-03-01",
      condition: "Good",
    },
    {
      id: 2,
      assetName: "Office Desk",
      assetType: "Furniture",
      assignedTo: "Jane Smith",
      department: "HR",
      assignedDate: "2025-02-20",
      condition: "Satisfactory",
    },
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-30 px-6">
      <div className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          View Assigned Assets
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#3A6D8C] text-white">
                <th className="p-3">Asset Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned Date</th>
                <th className="p-3">Condition</th>
              </tr>
            </thead>
            <tbody>
              {assignedAssets.map((asset, index) => (
                <tr
                  key={asset.id}
                  className={`border-b border-gray-300 text-center ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3">{asset.assetName}</td>
                  <td className="p-3">{asset.assetType}</td>
                  <td className="p-3">{asset.assignedTo}</td>
                  <td className="p-3">{asset.department}</td>
                  <td className="p-3">{asset.assignedDate}</td>
                  <td className="p-3 text-[#6A9AB0] font-semibold">
                    {asset.condition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAssignedAssets;
