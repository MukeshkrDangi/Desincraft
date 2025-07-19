import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem('adminToken'); // ✅ Check token

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />; // ✅ Redirect if not logged in
    }

    return children; // ✅ Allow access if logged in
}
