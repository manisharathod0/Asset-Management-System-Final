import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RequestNewAsset from "./dashboard/Manager/RequestNewAsset";
import NotFound from "./pages/NotFound";


const AppRoutes = () => {
  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<LoginPage />} />  
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/request-new-asset" element={<RequestNewAsset />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
