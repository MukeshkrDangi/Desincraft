// admin/src/components/RequireAuth.jsx
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
