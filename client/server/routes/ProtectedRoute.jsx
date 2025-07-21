// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user || !user._id) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Admin-only route check
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
