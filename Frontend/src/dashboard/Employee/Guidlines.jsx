import { motion } from "framer-motion";

const Guidelines = () => {
  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Guidelines</h2>
      <div className="text-gray-700 text-lg space-y-4">
        <p><strong>1. Asset Usage:</strong> Use assigned assets responsibly and only for official purposes.</p>
        <p><strong>2. Maintenance:</strong> Report any issues immediately through the 'Report Issue' section.</p>
        <p><strong>3. Return Policy:</strong> If you no longer need an asset, submit a return request.</p>
        <p><strong>4. Security:</strong> Do not share assigned assets with unauthorized personnel.</p>
        <p><strong>5. Support:</strong> For any issues, contact the admin via the 'Contact Admin' section.</p>
      </div>
    </motion.div>
  );
};

export default Guidelines;