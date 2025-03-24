
// import { motion } from "framer-motion";

// const guidelinesData = [
//   {
//     id: 1,
//     title: "Asset Usage",
//     text: "Use assigned assets responsibly and only for official purposes.",
//     icon: (
//       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//       </svg>
//     ),
//   },
//   {
//     id: 2,
//     title: "Maintenance",
//     text: "Report any issues immediately through the 'Report Issue' section.",
//     icon: (
//       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
//       </svg>
//     ),
//   },
//   {
//     id: 3,
//     title: "Return Policy",
//     text: "If you no longer need an asset, submit a return request.",
//     icon: (
//       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//       </svg>
//     ),
//   },
//   {
//     id: 4,
//     title: "Security",
//     text: "Do not share assigned assets with unauthorized personnel.",
//     icon: (
//       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
//       </svg>
//     ),
//   },
//   {
//     id: 5,
//     title: "Support",
//     text: "For any issues, contact the admin via the 'Contact Admin' section.",
//     icon: (
//       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
//       </svg>
//     ),
//   },
// ];

// const Guidelines = () => {
//   return (
//     <motion.div 
//       className=" pt-20 p-8 bg-white shadow-xl rounded-2xl max-w-4xl mx-auto my-10 border border-blue-100"
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2 className="text-4xl font-bold text-center text-blue-800 mb-8">Guidelines</h2>
//       <div className="space-y-6">
//         {guidelinesData.map((item) => (
//           <motion.div 
//             key={item.id}
//             className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg shadow-sm"
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: item.id * 0.1 }}
//           >
//             <div className="flex-shrink-0">{item.icon}</div>
//             <div className="text-blue-800">
//               <p className="font-bold text-lg">{item.title}:</p>
//               <p className="ml-1">{item.text}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default Guidelines;

import { motion } from "framer-motion";

const guidelinesData = [
  {
    id: 1,
    title: "Asset Usage",
    text: "Use assigned assets responsibly and only for official purposes.",
    icon: (
      <svg className="w-6 h-6 text-[#001F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Maintenance",
    text: "Report any issues immediately through the 'Report Issue' section.",
    icon: (
      <svg className="w-6 h-6 text-[#001F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Return Policy",
    text: "If you no longer need an asset, submit a return request.",
    icon: (
      <svg className="w-6 h-6 text-[#001F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Security",
    text: "Do not share assigned assets with unauthorized personnel.",
    icon: (
      <svg className="w-6 h-6 text-[#001F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Support",
    text: "For any issues, contact the admin via the 'Contact Admin' section.",
    icon: (
      <svg className="w-6 h-6 text-[#001F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
      </svg>
    ),
  },
];

const Guidelines = () => {
  return (
    <motion.div 
      className=" pt-8 p-8 bg-white shadow-xl rounded-2xl max-w-4xl mx-auto mt-25 mb-10 border border-[#001F3F]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-center text-[#001F3F] mb-8">Guidelines</h2>
      <div className="space-y-6">
        {guidelinesData.map((item) => (
          <motion.div 
            key={item.id}
            className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-[#001F3F]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.id * 0.1 }}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <div className="text-[#001F3F]">
              <p className="font-bold text-lg">{item.title}:</p>
              <p className="ml-1">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Guidelines;
