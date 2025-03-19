import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const { user } = useAuth(); // Get user from AuthContext

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Redirect if role doesn't match
  }

  return <Outlet />; // Render child routes
};

export default ProtectedRoute;
