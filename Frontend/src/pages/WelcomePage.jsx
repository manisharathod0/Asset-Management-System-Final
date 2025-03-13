
import React from "react";

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#EAD8B1] px-6 py-25">
      
      {/* Title Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-[#001F3F]">
          Welcome to <span className="text-[#3A6D8C]">AssetEase</span>
        </h1>
        <p className="text-lg text-gray-700 mt-3">
          Smart & Efficient Asset Management for Modern Businesses 🚀
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-xl text-center border-l-4 border-[#3A6D8C] hover:scale-105 transition">
          <h2 className="text-2xl font-semibold text-[#3A6D8C] mb-3">📦 Asset Tracking</h2>
          <p className="text-gray-700">
            Monitor your assets in **real-time** with ease.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-xl text-center border-l-4 border-[#A27B5C] hover:scale-105 transition">
          <h2 className="text-2xl font-semibold text-[#A27B5C] mb-3">🔍 QR Code Integration</h2>
          <p className="text-gray-700">
            Scan and track assets instantly using **QR codes**.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-xl text-center border-l-4 border-[#3F4F44] hover:scale-105 transition">
          <h2 className="text-2xl font-semibold text-[#3F4F44] mb-3">⚙️ Automated Maintenance</h2>
          <p className="text-gray-700">
            Schedule and track **asset maintenance effortlessly**.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-lg shadow-xl text-center border-l-4 border-[#2C3930] hover:scale-105 transition">
          <h2 className="text-2xl font-semibold text-[#2C3930] mb-3">📊 Detailed Reports</h2>
          <p className="text-gray-700">
            Gain insights with **detailed analytics & reports**.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-6 rounded-lg shadow-xl text-center border-l-4 border-[#6A9AB0] hover:scale-105 transition">
          <h2 className="text-2xl font-semibold text-[#6A9AB0] mb-3">🔄 Request & Approval</h2>
          <p className="text-gray-700">
            Employees can **request and return assets** smoothly.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-6 rounded-lg shadow-xl text-center border-l-4 border-[#DCD7C9] hover:scale-105 transition">
          <h2 className="text-2xl font-semibold text-[#DCD7C9] mb-3">🛠️ Issue Reporting</h2>
          <p className="text-gray-700">
            Report damaged assets easily for quick resolutions.
          </p>
        </div>

      </div>

      {/* Closing Section */}
      <div className="mt-5 bg-[#3A6D8C] text-white p-8 rounded-lg shadow-lg text-center max-w-3xl">
        <h2 className="text-3xl font-semibold mb-3">🚀 Get Started with AssetEase</h2>
        <p className="text-lg">
          Manage your assets **smarter & faster** with our intuitive system.
        </p>
      </div>

    </div>
  );
};

export default WelcomePage;
