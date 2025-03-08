import { useState } from "react";

const ReportAnIssue = () => {
  const [issue, setIssue] = useState({
    assetId: "",
    assetName: "",
    issueDescription: "",
    urgency: "Medium",
  });

  const handleChange = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Issue Reported:", issue);
    alert("Issue reported successfully!");
    setIssue({ assetId: "", assetName: "", issueDescription: "", urgency: "Medium" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-30 px-6">
      <div className="max-w-3xl w-full p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Report an Issue
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Asset ID</label>
            <input
              type="text"
              name="assetId"
              placeholder="Enter Asset ID"
              value={issue.assetId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A6D8C] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Asset Name</label>
            <input
              type="text"
              name="assetName"
              placeholder="Enter Asset Name"
              value={issue.assetName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A6D8C] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Issue Description</label>
            <textarea
              name="issueDescription"
              placeholder="Describe the issue"
              value={issue.issueDescription}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A6D8C] focus:outline-none resize-none"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Urgency Level</label>
            <select
              name="urgency"
              value={issue.urgency}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-[#3A6D8C] focus:outline-none"
            >
              <option value="Low">Low - Minor issue, can be resolved later</option>
              <option value="Medium">Medium - Needs attention soon</option>
              <option value="High">High - Requires immediate action</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#3A6D8C] text-white font-medium px-4 py-3 rounded-lg hover:bg-[#6A9AB0] transition duration-300"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportAnIssue;
