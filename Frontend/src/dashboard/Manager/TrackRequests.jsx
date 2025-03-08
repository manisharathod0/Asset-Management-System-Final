import { useState } from "react";

const TrackRequests = () => {
  const [requests, setRequests] = useState([
    { id: "REQ123", asset: "Laptop", status: "Pending", date: "2025-03-04" },
    { id: "REQ124", asset: "Monitor", status: "Approved", date: "2025-03-03" },
    { id: "REQ125", asset: "Keyboard", status: "Rejected", date: "2025-03-02" },
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-6">
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Track Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-[#3A6D8C] text-white text-left">
                <th className="py-3 px-5">Request ID</th>
                <th className="py-3 px-5">Asset</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-5">{request.id}</td>
                  <td className="py-3 px-5">{request.asset}</td>
                  <td
                    className={`py-3 px-5 font-semibold ${
                      request.status === "Pending"
                        ? "text-yellow-600"
                        : request.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {request.status}
                  </td>
                  <td className="py-3 px-5">{request.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrackRequests;
