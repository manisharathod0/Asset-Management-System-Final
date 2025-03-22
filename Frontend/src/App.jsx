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
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";
import WelcomePage from "./pages/WelcomePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Admin components
import AllAssets from "./dashboard/Admin/AllAssets";
import AddNewAsset from "./dashboard/Admin/AddNewAsset";
import AssetHistory from "./dashboard/Admin/AssetHistory";
import AssignAsset from "./dashboard/Admin/AssignAsset";
import AdminReturnAsset from "./dashboard/Admin/AdminReturnAsset";
import AssetRequests from "./dashboard/Admin/AssetRequests";
import ScheduledMaintenance from "./dashboard/Admin/ScheduleMaintenance";
import RequestRepair from "./dashboard/Admin/RequestRepair";
import RepairStatus from "./dashboard/Admin/RepairStatus";
import Reports from "./dashboard/Admin/Reports";
import AllUsers from "./dashboard/Admin/AllUsers";
import AddUser from "./dashboard/Admin/AddUser";
import GenerateQR from "./dashboard/Admin/GenerateQR";
import ScanQR from "./dashboard/Admin/ScanQR";
import QRCodeLog from "./dashboard/Admin/QRCodeLog";

// Import Employee components
import ViewMyAsset from "./dashboard/Employee/ViewMyAsset";
import ContactAdmin from "./dashboard/Employee/ContactAdmin";
import Guidlines from "./dashboard/Employee/Guidlines";
import ScanQRCode from "./dashboard/Employee/ScanQRCode";
import ViewRequestStatus from "./dashboard/Employee/ViewRequestStatus";
import ReturnRequest from "./dashboard/Employee/ReturnRequest";
import ReportAnIssue from "./dashboard/Employee/ReportAnIssue";
import RequestNewAsset from "./dashboard/Employee/RequestNewAsset";

import "./styles/global.css";
import "./App.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const showSidebar =
    location.pathname.startsWith("/admin") ||
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
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <div className="app-container">
                <Navbar />
                <WelcomePage />
              </div>
            }
          />
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

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin/*"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/all-assets"
              element={
                <Layout>
                  <AllAssets />
                </Layout>
              }
            />
            <Route
              path="/admin/add-asset"
              element={
                <Layout>
                  <AddNewAsset />
                </Layout>
              }
            />
            <Route
              path="/admin/history"
              element={
                <Layout>
                  <AssetHistory />
                </Layout>
              }
            />
            <Route
              path="/admin/assign-asset"
              element={
                <Layout>
                  <AssignAsset />
                </Layout>
              }
            />
            <Route
              path="/admin/return-asset"
              element={
                <Layout>
                  <AdminReturnAsset />
                </Layout>
              }
            />
            <Route
              path="/admin/repair-status"
              element={
                <Layout>
                  <RepairStatus />
                </Layout>
              }
            />
            <Route
              path="/admin/asset-requests"
              element={
                <Layout>
                  <AssetRequests />
                </Layout>
              }
            />
            <Route
              path="/admin/generate-qr"
              element={
                <Layout>
                  <GenerateQR />
                </Layout>
              }
            />
            <Route
              path="/admin/scan-qr"
              element={
                <Layout>
                  <ScanQR />
                </Layout>
              }
            />
            <Route
              path="/admin/admin-qr-logs"
              element={
                <Layout>
                  <QRCodeLog />
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
              path="/admin/asset-reports"
              element={
                <Layout>
                  <Reports />
                </Layout>
              }
            />

            <Route
              path="/admin/all-users"
              element={
                <Layout>
                  <AllUsers />
                </Layout>
              }
            />
            <Route
              path="/admin/add-user"
              element={
                <Layout>
                  <AddUser />
                </Layout>
              }
            />
          </Route>

          {/* Protected Employee Routes */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route
              path="/employee/*"
              element={
                <Layout>
                  <EmployeeDashboard />
                </Layout>
              }
            />
            <Route
              path="/employee/view-my-assets"
              element={
                <Layout>
                  <ViewMyAsset />
                </Layout>
              }
            />
            <Route
              path="/employee/scan-qr"
              element={
                <Layout>
                  <ScanQRCode />
                </Layout>
              }
            />
            <Route
              path="/employee/return-request"
              element={
                <Layout>
                  <ReturnRequest />
                </Layout>
              }
            />
            <Route
              path="/employee/contact-support"
              element={
                <Layout>
                  <ContactAdmin />
                </Layout>
              }
            />
            <Route
              path="/employee/guidelines"
              element={
                <Layout>
                  <Guidlines />
                </Layout>
              }
            />
            <Route
              path="/employee/report-issue"
              element={
                <Layout>
                  <ReportAnIssue />
                </Layout>
              }
            />
            <Route
              path="/employee/request-status"
              element={
                <Layout>
                  <ViewRequestStatus />
                </Layout>
              }
            />
            <Route
              path="/employee/request-asset"
              element={
                <Layout>
                  <RequestNewAsset />
                </Layout>
              }
            />
          </Route>

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
