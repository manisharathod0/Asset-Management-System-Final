import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RequestNewAsset from "./dashboard/Manager/RequestNewAsset";
import PendingRequests from "./dashboard/Manager/PendingRequests"; // Import PendingRequests
import NotFound from "./pages/NotFound";
import ViewAssignedAssets from "./dashboard/Manager/ViewAssignedAssets";
import ReturnAsset from "./dashboard/Manager/ReturnAsset";
import AssetConditionReports from "./dashboard/Manager/AssetConditionReports";
import ReportAnIssue from "./dashboard/Manager/ReportanIssue";
import TrackRequests from "./dashboard/Manager/TrackRequests";
import ManageEmployeeRequests from "./dashboard/Manager/ManageEmployeeRequests";
import QRCodeLogs from "./dashboard/Manager/QRCodeLogs";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />  
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/request-new-asset" element={<RequestNewAsset />} />
        <Route path="/manager/pending-requests" element={<PendingRequests />} /> {/* Added route */}
        <Route path="/manager/view-assigned-assets" element={<ViewAssignedAssets />} /> 
        <Route path="/manager/return-assets" element={<ReturnAsset />} />
        <Route path="/manager/asset-condition-reports" element={<AssetConditionReports/>} />
        <Route path="/manager/qr-code-logs" element={<QRCodeLogs/>} />
        <Route path="/manager/report-issue" element={<ReportAnIssue/>} />
        <Route path="/manager/track-requests" element={<TrackRequests/>} />
        <Route path="/manager/manage-employee-requests" element={<ManageEmployeeRequests/>} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
