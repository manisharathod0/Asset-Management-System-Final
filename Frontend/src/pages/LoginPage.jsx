import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

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
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
