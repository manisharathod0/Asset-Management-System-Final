import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RequestNewAsset from "./dashboard/Manager/RequestNewAsset";
import PendingRequests from "./dashboard/Manager/PendingRequests";
import ViewAssignedAssets from "./dashboard/Manager/ViewAssignedAssets";
import NotFound from "./pages/NotFound";
import "./styles/global.css";
import "./App.css";
import ReturnAsset from "./dashboard/Manager/ReturnAsset";
import AssetConditionReports from "./dashboard/Manager/AssetConditionReports";
import ReportAnIssue from "./dashboard/Manager/ReportanIssue";
import TrackRequests from "./dashboard/Manager/TrackRequests";
import ManageEmployeeRequests from "./dashboard/Manager/ManageEmployeeRequests";
import QRCodeLogs from "./dashboard/Manager/QRCodeLogs";
import ScheduledMaintenance from "./dashboard/Admin/ScheduleMaintenance";
import RequestRepair from "./dashboard/Admin/RequestRepair";

const Layout = ({ children }) => {
  const location = useLocation();
  const showSidebar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/employee");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar />
      <div className="flex main-content">
        {showSidebar && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
        <div
          className={`flex-1 transition-all duration-500 ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <Navbar />
              <div className="login-container">
                <LoginPage />
              </div>
            </div>
          }
        />
        <Route
          path="/admin/*"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />
         <Route
          path="/admin/scheduled-maintenance"
          element={
            <Layout>
              <ScheduledMaintenance />
            </Layout>
          }
        />
        <Route
          path="/admin/request-repair"
          element={
            <Layout>
              <RequestRepair />
            </Layout>
          }
        />
        <Route
          path="/manager/*"
          element={
            <Layout>
              <ManagerDashboard />
            </Layout>
          }
        />
        <Route
          path="/manager/request-new-asset"
          element={
            <Layout>
              <RequestNewAsset />
            </Layout>
          }
        />{" "}
        {/* Fixed Route */}
        <Route
          path="/manager/pending-requests"
          element={
            <Layout>
              <PendingRequests />
            </Layout>
          }
        />{" "}
        <Route
          path="/manager/view-assigned-assets"
          element={
            <Layout>
              <ViewAssignedAssets />
            </Layout>
          }
        />{" "}
        <Route
          path="/manager/return-assets"
          element={
            <Layout>
              <ReturnAsset />
            </Layout>
          }
        />{" "}
        <Route
          path="/manager/asset-condition-reports"
          element={
            <Layout>
              <AssetConditionReports/>
            </Layout>
          }
        />{" "}
        <Route
          path="/manager/qr-code-logs"
          element={
            <Layout>
              <QRCodeLogs/>
            </Layout>
          }
        />{" "}
        <Route
          path="/manager/report-issue"
          element={
            <Layout>
              <ReportAnIssue/>
            </Layout>
          }
        />{" "}
        <Route
          path="/manager/track-requests"
          element={
            <Layout>
              <TrackRequests/>
            </Layout>
          }
        />{" "}
        <Route
          path="/manager/manage-employee-requests"
          element={
            <Layout>
              <ManageEmployeeRequests/>
            </Layout>
          }
        />{" "}
        
        {/* Add this route */}
        <Route
          path="/employee/*"
          element={
            <Layout>
              <EmployeeDashboard />
            </Layout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
