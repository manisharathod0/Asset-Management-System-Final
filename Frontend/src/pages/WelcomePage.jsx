import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAD8B1] to-[#F5E9D0] px-6 py-32">
      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 transform hover:scale-105 transition-all duration-500">
          <h1 className="text-6xl font-extrabold text-[#001F3F] mb-4">
            Welcome to <span className="bg-gradient-to-r from-[#3A6D8C] to-[#6A9AB0] bg-clip-text text-transparent">AssetEase</span>
          </h1>
          <p className="text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
            Streamline your asset management with our modern, intuitive platform designed for today's businesses
          </p>
          <div className="flex justify-center mt-8 space-x-4">
            <Link to="/login">
              <button className="px-8 py-3 rounded-lg font-semibold border-2 border-[#3A6D8C] text-[#3A6D8C] hover:bg-[#3A6D8C] hover:text-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Cards with animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-l-4 border-[#3A6D8C] hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-[#EBF6FF] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#3A6D8C] mb-3">Asset Tracking</h2>
            <p className="text-gray-700">
              Monitor your assets in real-time with comprehensive tracking and location management.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-l-4 border-[#A27B5C] hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-[#FFF5EB] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#A27B5C] mb-3">QR Code Integration</h2>
            <p className="text-gray-700">
              Scan and track assets instantly using QR codes for seamless inventory management.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-l-4 border-[#3F4F44] hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-[#EBFFEF] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#3F4F44] mb-3">Automated Maintenance</h2>
            <p className="text-gray-700">
              Schedule and track asset maintenance effortlessly with automated reminders and workflows.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-l-4 border-[#2C3930] hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-[#F0F5F2] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#2C3930] mb-3">Detailed Reports</h2>
            <p className="text-gray-700">
              Gain insights with detailed analytics and customizable reports for data-driven decisions.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-l-4 border-[#6A9AB0] hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-[#EBF8FF] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#6A9AB0] mb-3">Request & Approval</h2>
            <p className="text-gray-700">
              Employees can request and return assets smoothly through our intuitive approval system.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-l-4 border-[#DCD7C9] hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-[#F7F5F0] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛠️</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#DCD7C9] mb-3">Issue Reporting</h2>
            <p className="text-gray-700">
              Report damaged assets easily for quick resolutions and maintain equipment reliability.
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-[#3A6D8C] to-[#6A9AB0] text-white p-10 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all duration-500">
            <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Asset Management?</h2>
            <p className="text-xl mb-6">
              Join thousands of businesses that have simplified their asset tracking and management with AssetEase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;