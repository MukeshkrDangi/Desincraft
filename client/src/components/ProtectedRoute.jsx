import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  // 🔐 Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Redirect if not admin and adminOnly is true
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allow access
  return children;
}
