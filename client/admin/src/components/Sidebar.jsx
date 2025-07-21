import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="flex gap-4 mb-6">
            <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Admin Panel</Link>
            <Link to="/upload" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Upload Portfolio</Link>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
    );
}
