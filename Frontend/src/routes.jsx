// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import AdminDashboard from "./pages/AdminDashboard";
// import AllAssets from "./dashboard/Admin/AllAssets";
// import AddNewAsset from "./dashboard/Admin/AddNewAsset";
// import AssetCategories from "./dashboard/Admin/AssetCategories";
// import AssetHistory from "./dashboard/Admin/AssetHistory";
// import AssignAsset from "./dashboard/Admin/AssignAsset";
// import ReturnAsset from "./dashboard/Admin/AdminReturnAsset";
// import AssetRequests from "./dashboard/Admin/AssetRequests";
// import ScheduledMaintenance from "./dashboard/Admin/ScheduleMaintenance";
// import EmployeeDashboard from "./pages/EmployeeDashboard";
// import NotFound from "./pages/NotFound";
// import ViewMyAsset from "./dashboard/Employee/ViewMyAsset";
// import ReturnRequest from "./dashboard/Employee/ReturnRequest";
// import ReportAnIssue from "./dashboard/Employee/ReportAnIssue";
// import ScanQRCode from "./dashboard/Employee/ScanQRCode";
// import RequestNewAsset from "./dashboard/Employee/RequestNewAsset";
// import ViewRequestStatus from "./dashboard/Employee/ViewRequestStatus";
// import Guidelines from "./dashboard/Employee/Guidlines";
// import ContactAdmin from "./dashboard/Employee/ContactAdmin";


// const AppRoutes = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route
//           path="/admin/all-assets"
//           element={
//             <Layout>
//               <AllAssets />
//             </Layout>
//           }
//         />
//         <Route
//           path="/admin/add-asset"
//           element={
//             <Layout>
//               <AddNewAsset />
//             </Layout>
//           }
//         />
//         <Route
//           path="/admin/categories"
//           element={
//             <Layout>
//               <AssetCategories />
//             </Layout>
//           }
//         />
//         <Route
//           path="/admin/history"
//           element={
//             <Layout>
//               <AssetHistory />
//             </Layout>
//           }
//         />
//         <Route
//           path="/admin/assign-asset"
//           element={
//             <Layout>
//               <AssignAsset />
//             </Layout>
//           }
//         />
//         <Route
//           path="/admin/return-asset"
//           element={
//             <Layout>
//               <ReturnAsset />
//             </Layout>
//           }
//         />
//         <Route
//           path="/admin/asset-requests"
//           element={
//             <Layout>
//               <AssetRequests />
//             </Layout>
//           }
//         />
//         <Route
//           path="/admin/scheduled-maintenance"
//           element={
//             <Layout>
//               <ScheduledMaintenance />
//             </Layout>
//           }
//         />

//         <Route path="/employee" element={<EmployeeDashboard />} />
//         <Route path="/employee/view-my-assets" element={<ViewMyAsset />} />
//         <Route path="/employee/return-request" element={<ReturnRequest />} />
//         <Route path="/employee/report-issue" element={<ReportAnIssue />} />
//         <Route path="/employee/scan-qr" element={<ScanQRCode />} />
//         <Route path="/employee/request-asset" element={<RequestNewAsset />} />
//         <Route path="/employee/request-status" element={<ViewRequestStatus />} />
//         <Route path="/employee/guidelines" element={<Guidelines />} />
//         <Route path="/employee/contact-support" element={<ContactAdmin />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;
