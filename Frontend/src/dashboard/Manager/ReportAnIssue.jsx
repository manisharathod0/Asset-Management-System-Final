import { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-100 py-30 px-6"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-3xl w-full p-8 bg-white shadow-lg rounded-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl font-semibold mb-6 text-gray-800 text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          Report an Issue
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {['assetId', 'assetName', 'issueDescription'].map((field, index) => (
            <motion.div 
              key={field} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <label className="block text-gray-700 font-medium mb-1">
                {field === "issueDescription" ? "Issue Description" : field.replace("Id", " ID").replace("Name", " Name")}
              </label>
              {field === "issueDescription" ? (
                <textarea
                  name={field}
                  placeholder="Describe the issue"
                  value={issue[field]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A6D8C] focus:outline-none resize-none"
                  rows="4"
                ></textarea>
              ) : (
                <input
                  type="text"
                  name={field}
                  placeholder={`Enter ${field.replace("Id", " ID").replace("Name", " Name")}`}
                  value={issue[field]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A6D8C] focus:outline-none"
                />
              )}
            </motion.div>
          ))}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
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
          </motion.div>
          <motion.button
            type="submit"
            className="w-full bg-[#3A6D8C] text-white font-medium px-4 py-3 rounded-lg hover:bg-[#6A9AB0] transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Issue
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReportAnIssue;