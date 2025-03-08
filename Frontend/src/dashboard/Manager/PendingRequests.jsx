import { useState } from "react";

const PendingRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      assetName: "Laptop",
      assetType: "Electronics",
      quantity: 2,
      urgency: "High",
      requestedBy: "John Doe",
      department: "IT",
      status: "Pending",
    },
    {
      id: 2,
      assetName: "Office Chair",
      assetType: "Furniture",
      quantity: 5,
      urgency: "Medium",
      requestedBy: "Jane Smith",
      department: "HR",
      status: "Pending",
    },
  ]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Pending Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-[#3A6D8C] text-white">
                <th className="p-3">Asset Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Urgency</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={request.id}
                  className={`border-b border-gray-300 text-center ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3">{request.assetName}</td>
                  <td className="p-3">{request.assetType}</td>
                  <td className="p-3">{request.quantity}</td>
                  <td className="p-3">{request.urgency}</td>
                  <td className="p-3">{request.requestedBy}</td>
                  <td className="p-3">{request.department}</td>
                  <td className="p-3 text-[#6A9AB0] font-semibold">
                    {request.status}
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

export default PendingRequests;
