

// import React from "react";
// import { motion } from "framer-motion";

// const ContactITAdmin = () => {
//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center p-6"
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.7 }}
//     >
//       <motion.h1
//         className="text-4xl font-extrabold text-[#001F3F] mb-8 drop-shadow-md"
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//       >
//         Contact IT - Admin Support
//       </motion.h1>
//       <motion.div
//         className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-blue-100 mt-10"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5, duration: 0.5 }}
//       >
//         <motion.p
//           className="text-[#001F3F] text-lg mb-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6, duration: 0.5 }}
//         >
//           If you are facing any technical issues, please reach out to our IT
//           team.
//         </motion.p>
//         <motion.div
//           className="bg-[#D1E3F0] p-6 rounded-lg mb-6"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.7, duration: 0.5 }}
//         >
//           <motion.h2
//             className="text-2xl font-semibold text-[#001F3F] mb-3"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8, duration: 0.5 }}
//           >
//             Support Details
//           </motion.h2>
//           <motion.p
//             className="text-[#001F3F] mb-2"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.9, duration: 0.5 }}
//           >
//             📧 Email:{" "}
//             <a
//               href="mailto:support@company.com"
//               className="underline hover:text-[#001F3F]"
//             >
//               support@company.com
//             </a>
//           </motion.p>
//           <motion.p
//             className="text-[#001F3F] mb-2"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.0, duration: 0.5 }}
//           >
//             📞 Phone:{" "}
//             <a
//               href="tel:+12345678900"
//               className="underline hover:text-[#001F3F]"
//             >
//               +1 (234) 567-8900
//             </a>
//           </motion.p>
//           <motion.p
//             className="text-[#001F3F]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.1, duration: 0.5 }}
//           >
//             🕒 Available: 9 AM - 6 PM (Mon-Fri)
//           </motion.p>
//         </motion.div>
//         <motion.button
//           className="w-full bg-[#D1E3F0] text-[#001F3F] font-bold py-3 px-4 rounded-lg shadow-md"
//           whileHover={{ scale: 1.05, backgroundColor: "#A4C2DA" }}
//           whileTap={{ scale: 0.95 }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{
//             type: "spring",
//             stiffness: 300,
//             delay: 1.2,
//             duration: 0.5,
//           }}
//         >
//           Request Support
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ContactITAdmin;


import React from "react";
import { motion } from "framer-motion";

const ContactITAdmin = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-[#001F3F] mb-8 drop-shadow-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Contact IT - Admin Support
      </motion.h1>
      <motion.div 
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-blue-100 mt-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.p 
          className="text-[#001F3F] text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          If you are facing any technical issues, please reach out to our IT team.
        </motion.p>
        <motion.div 
          className="bg-[#D1E3F0] p-6 rounded-lg mb-6 w-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-semibold text-[#001F3F] mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Support Details
          </motion.h2>
          <motion.p 
            className="text-[#001F3F] mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            📧 Email:{" "}
            <a href="mailto:support@company.com" className="underline hover:text-[#001F3F]">
              support@company.com
            </a>
          </motion.p>
          <motion.p 
            className="text-[#001F3F] mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            📞 Phone:{" "}
            <a href="tel:+12345678900" className="underline hover:text-[#001F3F]">
              +1 (234) 567-8900
            </a>
          </motion.p>
          <motion.p 
            className="text-[#001F3F]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            🕒 Available: 9 AM - 6 PM (Mon-Fri)
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ContactITAdmin;
