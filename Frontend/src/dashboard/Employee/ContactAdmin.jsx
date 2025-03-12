import React from "react";

const ContactITAdmin = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-[#001F3F] mb-6">Contact IT - Admin Support</h1>
      <div className="w-full max-w-lg bg-[#F3F4F6] p-6 rounded-lg shadow-md">
        <p className="text-[#001F3F] mb-4">
          If you are facing any technical issues, please reach out to the IT team.
        </p>
        <div className="bg-[#D1E3F0] p-4 rounded-md">
          <h2 className="text-xl font-semibold text-[#001F3F] mb-2">Support Details</h2>
          <p className="text-[#001F3F]">📧 Email: support@company.com</p>
          <p className="text-[#001F3F]">📞 Phone: +1 (234) 567-8900</p>
          <p className="text-[#001F3F]">🕒 Available: 9 AM - 6 PM (Mon-Fri)</p>
        </div>
        <button className="mt-6 bg-[#D1E3F0] text-[#001F3F] font-bold py-2 px-4 rounded-md hover:bg-[#A4C2DA] transition">
          Request Support
        </button>
      </div>
    </div>
  );
};

export default ContactITAdmin;