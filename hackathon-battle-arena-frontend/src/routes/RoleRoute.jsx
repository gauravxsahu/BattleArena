import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Restricts a route subtree to a specific role. This is a UX convenience
 * only — the backend independently enforces role authorization on every
 * request, so this guard never substitutes for that.
 */
export default function RoleRoute({ role }) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
