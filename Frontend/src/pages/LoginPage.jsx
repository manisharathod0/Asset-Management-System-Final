import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hardcoded user credentials
  const users = {
    "admin@example.com": { role: "admin", password: "admin123" },
    "manager@example.com": { role: "manager", password: "manager123" },
    "employee@example.com": { role: "employee", password: "employee123" },
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if email exists in users object
    if (users[email] && users[email].password === password) {
      // Redirect based on role
      navigate(`/${users[email].role}/dashboard`);
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[var(--background-light)]">
      <div className="bg-[var(--white)] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--primary-dark)]">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[var(--primary-medium)] mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-medium)]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[var(--primary-medium)] mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-medium)]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary-dark)] text-[var(--white)] p-2 rounded hover:bg-[var(--primary-medium)] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;