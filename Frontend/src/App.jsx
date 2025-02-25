import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";
import "./styles/global.css";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="page-content">{children}</div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      {/* ✅ Navbar is now always visible */}
      <Navbar />  
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/*" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/manager/*" element={<Layout><ManagerDashboard /></Layout>} />
        <Route path="/employee/*" element={<Layout><EmployeeDashboard /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
