import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

// <ProtectedRoute roles={["admin", "super_admin"]}>...</ProtectedRoute>
export default function ProtectedRoute({ roles, children }) {
  const { user, chargement } = useAuth();
  if (chargement) return null;
  if (!user) return <Navigate to="/connexion" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
