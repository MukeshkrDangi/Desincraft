import { Link, useNavigate } from 'react-router-dom';

export default function AdminNavigation() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken'); // ✅ Remove token from localStorage
        navigate('/login'); // ✅ Redirect to login page
    };

    return (
        <div className="flex gap-4 mb-6">
            <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Upload Service
            </Link>
            <Link to="/upload" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
                Upload Portfolio
            </Link>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}
