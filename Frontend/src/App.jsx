
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
import AllAssets from "./dashboard/Admin/AllAssets";
import AddNewAsset from "./dashboard/Admin/AddNewAsset";
import AssetCategories from "./dashboard/Admin/AssetCategories";
import AssetHistory from "./dashboard/Admin/AssetHistory";
import AssignAsset from "./dashboard/Admin/AssignAsset";
import AdminReturnAsset from "./dashboard/Admin/AdminReturnAsset";  // Renamed for Admin
import AssetRequests from "./dashboard/Admin/AssetRequests";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RequestNewAsset from "./dashboard/Manager/RequestNewAsset";
import PendingRequests from "./dashboard/Manager/PendingRequests";
import ManagerReturnAsset from "./dashboard/Manager/ManagerReturnAsset";  // Renamed for Manager
import ViewAssignedAssets from "./dashboard/Manager/ViewAssignedAssets";
import NotFound from "./pages/NotFound";
import "./styles/global.css";
import "./App.css";
import AssetConditionReports from "./dashboard/Manager/AssetConditionReports";
import ReportAnIssue from "./dashboard/Manager/ReportanIssue";
import TrackRequests from "./dashboard/Manager/TrackRequests";
import ManageEmployeeRequests from "./dashboard/Manager/ManageEmployeeRequests";
import QRCodeLogs from "./dashboard/Manager/QRCodeLogs";
import ScheduledMaintenance from "./dashboard/Admin/ScheduleMaintenance";
import RequestRepair from "./dashboard/Admin/RequestRepair";
import RepairStatus from "./dashboard/Admin/RepairStatus";
import Reports from "./dashboard/Admin/Reports";
import AllUsers from "./dashboard/Admin/AllUsers";
import AddUser from "./dashboard/Admin/AddUser";
import ViewMyAsset from "./dashboard/Employee/ViewMyAsset";
import ContactAdmin from "./dashboard/Employee/ContactAdmin";
import Guidlines from "./dashboard/Employee/Guidlines";
import ScanQRCode from "./dashboard/Employee/ScanQRCode";
import ViewRequestStatus from "./dashboard/Employee/ViewRequestStatus";
import ReturnRequest from "./dashboard/Employee/ReturnRequest";
import SignUpPage from "./pages/SignUpPage";
import WelcomePage from "./pages/WelcomePage";
import { AuthProvider } from "./context/AuthContext";

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
    <AuthProvider>
      <Router>
        <Routes>
          {/* Welcome Page */}
          <Route
            path="/"
            element={
              <div className="app-container">
                <Navbar />
                <WelcomePage />
              </div>
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={
              <div className="app-container">
                <Navbar />
                <div className="auth-container">
                  <LoginPage />
                </div>
              </div>
            }
          />

          {/* Sign Up Page */}
          <Route
            path="/signup"
            element={
              <div className="app-container">
                <Navbar />
                <div className="auth-container">
                  <SignUpPage />
                </div>
              </div>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
          <Route path="/admin/all-assets" element={<Layout><AllAssets /></Layout>} />
          <Route path="/admin/add-asset" element={<Layout><AddNewAsset /></Layout>} />
          <Route path="/admin/categories" element={<Layout><AssetCategories /></Layout>} />
          <Route path="/admin/history" element={<Layout><AssetHistory /></Layout>} />
          <Route path="/admin/assign-asset" element={<Layout><AssignAsset /></Layout>} />
          <Route path="/admin/return-asset" element={<Layout><AdminReturnAsset /></Layout>} />
          <Route path="/admin/repair-status" element={<Layout><RepairStatus /></Layout>} />
          <Route path="/admin/asset-requests" element={<Layout><AssetRequests /></Layout>} />
          <Route path="/admin/asset-reports" element={<Layout><Reports /></Layout>} />
          <Route path="/admin/all-users" element={<Layout><AllUsers /></Layout>} />
          <Route path="/admin/add-user" element={<Layout><AddUser /></Layout>} />

          {/* Employee Routes */}
          <Route path="/employee/view-my-assets" element={<Layout><ViewMyAsset /></Layout>} />
          <Route path="/employee/contact-support" element={<Layout><ContactAdmin /></Layout>} />
          <Route path="/employee/guidelines" element={<Layout><Guidlines /></Layout>} />
          <Route path="/employee/report-issue" element={<Layout><ReportAnIssue /></Layout>} />
          <Route path="/employee/request-asset" element={<Layout><RequestNewAsset /></Layout>} />
          <Route path="/employee/return-request" element={<Layout><ReturnRequest /></Layout>} />
          <Route path="/employee/scan-qr" element={<Layout><ScanQRCode /></Layout>} />
          <Route path="/employee/request-status" element={<Layout><ViewRequestStatus /></Layout>} />

          {/* Admin Maintenance Routes */}
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

          {/* Manager Routes */}
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
          />
          <Route
            path="/manager/pending-requests"
            element={
              <Layout>
                <PendingRequests />
              </Layout>
            }
          />
          <Route
            path="/manager/view-assigned-assets"
            element={
              <Layout>
                <ViewAssignedAssets />
              </Layout>
            }
          />
          <Route path="/manager/return-assets" element={<Layout><ManagerReturnAsset /></Layout>} />
          <Route
            path="/manager/asset-condition-reports"
            element={
              <Layout>
                <AssetConditionReports />
              </Layout>
            }
          />
          <Route
            path="/manager/qr-code-logs"
            element={
              <Layout>
                <QRCodeLogs />
              </Layout>
            }
          />
          <Route
            path="/manager/report-issue"
            element={
              <Layout>
                <ReportAnIssue />
              </Layout>
            }
          />
          <Route
            path="/manager/track-requests"
            element={
              <Layout>
                <TrackRequests />
              </Layout>
            }
          />
          <Route
            path="/manager/manage-employee-requests"
            element={
              <Layout>
                <ManageEmployeeRequests />
              </Layout>
            }
          />

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;