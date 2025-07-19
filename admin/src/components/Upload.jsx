import { useState, useEffect } from 'react';
import { fetchPortfolio, createPortfolio, deletePortfolio } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Upload() {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadPortfolio();
    }, []);

    const loadPortfolio = async () => {
        setLoading(true);
        try {
            const data = await fetchPortfolio();
            setPortfolioItems(data);
        } catch (error) {
            console.error('Error loading portfolio:', error);
        }
        setLoading(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) {
            setMessage('❌ Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('image', image);

        setLoading(true);
        try {
            await createPortfolio(formData);
            setMessage('✅ Portfolio item uploaded successfully!');
            setTitle('');
            setDescription('');
            setCategory('');
            setImage(null);
            e.target.reset();
            loadPortfolio();
        } catch (error) {
            console.error('Error uploading portfolio:', error);
            setMessage('❌ Failed to upload portfolio item.');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deletePortfolio(id);
            setMessage('✅ Portfolio item deleted successfully!');
            loadPortfolio();
        } catch (error) {
            console.error('Error deleting portfolio item:', error);
            setMessage('❌ Failed to delete portfolio item.');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Upload Portfolio</h1>

            <div className="flex gap-4 mb-6">
                <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Admin Panel</Link>
                <Link to="/upload" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Upload Portfolio</Link>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
            </div>

            {message && <p className="mb-4 text-green-600">{message}</p>}
            {loading && <p className="mb-4 text-blue-600">Loading...</p>}

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-10">
                <input type="text" placeholder="Portfolio Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />
                <textarea placeholder="Portfolio Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded" required />
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="border p-2 rounded" required />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    {loading ? 'Uploading...' : 'Upload Portfolio'}
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4">Uploaded Portfolio Items</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {portfolioItems.length === 0 ? (
                    <p className="text-gray-500">No portfolio items uploaded yet.</p>
                ) : (
                    portfolioItems.map(item => (
                        <div key={item._id} className="border p-4 rounded shadow">
                            {item.imageUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover mb-4 rounded" />
                            ) : (
                                <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    📄 Download File
                                </a>
                            )}
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="mb-2">{item.description}</p>
                            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
