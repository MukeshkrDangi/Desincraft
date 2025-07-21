// client/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow bg-white sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-700">DesignCraft</Link>

      <div className="flex flex-wrap items-center gap-4">
        {/* ✅ Always visible */}
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/portfolio" className="text-blue-600 hover:underline">Portfolio</Link>
        <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link>

        {/* ✅ Only if NOT logged in */}
        {!isAuthenticated && (
          <>
            <Link to="/order" className="text-blue-600 hover:underline">Place Order</Link>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </>
        )}

        {/* ✅ If logged in as ADMIN */}
        {isAuthenticated && isAdmin && (
          <>
            <Link to="/admin" className="text-blue-600 hover:underline">Admin</Link>
            <Link to="/admin/orders" className="text-blue-600 hover:underline">Orders</Link>
            <Link to="/upload" className="text-blue-600 hover:underline">Upload</Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}

        {/* ✅ If logged in as CLIENT */}
        {isAuthenticated && !isAdmin && (
          <>
            <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
            <Link to="/my-orders" className="text-blue-600 hover:underline">My Orders</Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
