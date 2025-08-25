import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../app/auth/AuthProvider";

export default function ProtectedRoute() {
  const { state } = useAuth();
  if (state.role === "guest") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
