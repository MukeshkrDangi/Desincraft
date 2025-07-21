import { useState, useEffect } from 'react';
import { fetchPortfolio, createPortfolio, deletePortfolio } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../components/AdminNavigation';

export default function Upload() {
    const navigate = useNavigate();
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState('All');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPortfolio();
    }, []);

    const loadPortfolio = async () => {
        setLoading(true);
        try {
            const data = await fetchPortfolio();
            setPortfolioItems(data);
            setFilteredItems(data);

            const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
            setCategories(uniqueCategories);
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

        try {
            setLoading(true);
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
        try {
            setLoading(true);
            await deletePortfolio(id);
            setMessage('✅ Portfolio item deleted successfully!');
            loadPortfolio();
        } catch (error) {
            console.error('Error deleting portfolio item:', error);
            setMessage('❌ Failed to delete portfolio item.');
        }
        setLoading(false);
    };

    const handleFilterChange = (category) => {
        setFilter(category);
        if (category === 'All') {
            setFilteredItems(portfolioItems);
        } else {
            const filtered = portfolioItems.filter(item => item.category === category);
            setFilteredItems(filtered);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Upload Portfolio</h1>

            {/* ✅ Admin Navigation */}
            <AdminNavigation />

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

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleFilterChange(cat)}
                        className={`px-4 py-2 rounded ${filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Portfolio List */}
            <h2 className="text-2xl font-semibold mb-4">Uploaded Portfolio Items</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredItems.length === 0 ? (
                    <p className="text-gray-500">No portfolio items found.</p>
                ) : (
                    filteredItems.map(item => (
                        <div key={item._id} className="border p-4 rounded shadow">
                            {item.imageUrl.endsWith('.png') || item.imageUrl.endsWith('.jpg') || item.imageUrl.endsWith('.jpeg') || item.imageUrl.endsWith('.webp') || item.imageUrl.endsWith('.gif') ? (
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
