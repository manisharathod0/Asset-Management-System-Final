import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AllAssets from "./dashboard/Admin/AllAssets";
import AddNewAsset from "./dashboard/Admin/AddNewAsset";
import AssetCategories from "./dashboard/Admin/AssetCategories";
import AssetHistory from "./dashboard/Admin/AssetHistory";
import AssignAsset from "./dashboard/Admin/AssignAsset";
import ReturnAsset from "./dashboard/Admin/AdminReturnAsset";
import AssetRequests from "./dashboard/Admin/AssetRequests";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RequestNewAsset from "./dashboard/Manager/RequestNewAsset";
import PendingRequests from "./dashboard/Manager/PendingRequests"; 
import NotFound from "./pages/NotFound";
import ViewAssignedAssets from "./dashboard/Manager/ViewAssignedAssets";
import ReturnAsset from "./dashboard/Manager/ManagerReturnAsset";
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
        <Route path="/admin/all-assets" element={<Layout><AllAssets /></Layout>} />
        <Route path="/admin/add-asset" element={<Layout><AddNewAsset /></Layout>} />
        <Route path="/admin/categories" element={<Layout><AssetCategories /></Layout>} />
        <Route path="/admin/history" element={<Layout><AssetHistory /></Layout>} />
        <Route path="/admin/assign-asset" element={<Layout><AssignAsset /></Layout>} />
        <Route path="/admin/return-asset" element={<Layout><ReturnAsset /></Layout>} />
        <Route path="/admin/asset-requests" element={<Layout><AssetRequests /></Layout>} />
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
