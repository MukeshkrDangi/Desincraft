import { useState, useEffect } from 'react';
import { fetchServices, addService, deleteService, fetchPortfolio, deletePortfolio } from '../services/api';
import { Link } from 'react-router-dom';

export default function Admin() {
    const [services, setServices] = useState([]);
    const [portfolioItems, setPortfolioItems] = useState([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState('');

    // ✅ Load services and portfolio on page load
    useEffect(() => {
        loadServices();
        loadPortfolioItems();
    }, []);

    const loadServices = async () => {
        try {
            const data = await fetchServices();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const loadPortfolioItems = async () => {
        try {
            const data = await fetchPortfolio();
            setPortfolioItems(data);
        } catch (error) {
            console.error('Error fetching portfolio items:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addService({ title, description, imageUrl });
            setMessage('✅ Service uploaded successfully!');
            setTitle('');
            setDescription('');
            setImageUrl('');
            loadServices(); // Refresh service list
        } catch (error) {
            console.error('Error uploading service:', error);
            setMessage('❌ Failed to upload service');
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await deleteService(id);
            setMessage('✅ Service deleted successfully!');
            loadServices(); // Refresh service list
        } catch (error) {
            console.error('Error deleting service:', error);
            setMessage('❌ Failed to delete service');
        }
    };

    const handleDeletePortfolio = async (id) => {
        try {
            await deletePortfolio(id);
            setMessage('✅ Portfolio item deleted successfully!');
            loadPortfolioItems(); // Refresh portfolio list
        } catch (error) {
            console.error('Error deleting portfolio item:', error);
            setMessage('❌ Failed to delete portfolio item');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Panel – Manage Services & Portfolio</h1>

            {/* Admin Navigation */}
            <div className="flex gap-4 mb-6">
                <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload Service</Link>
                <Link to="/upload" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Upload Portfolio</Link>
            </div>

            {message && <p className="mb-4 text-green-600">{message}</p>}

            {/* Upload Service Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
                <input
                    type="text"
                    placeholder="Service Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <textarea
                    placeholder="Service Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Upload Service
                </button>
            </form>

            {/* Services List */}
            <h2 className="text-2xl font-semibold mb-4">Uploaded Services</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-10">
                {services.length === 0 ? (
                    <p className="text-gray-500">No services uploaded yet.</p>
                ) : (
                    services.map(service => (
                        <div key={service._id} className="border p-4 rounded shadow">
                            <img src={service.imageUrl} alt={service.title} className="w-full h-48 object-cover mb-4 rounded" />
                            <h3 className="text-xl font-bold">{service.title}</h3>
                            <p className="mb-2">{service.description}</p>
                            <button
                                onClick={() => handleDeleteService(service._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Portfolio List */}
            <h2 className="text-2xl font-semibold mb-4">Uploaded Portfolio Items</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {portfolioItems.length === 0 ? (
                    <p className="text-gray-500">No portfolio items uploaded yet.</p>
                ) : (
                    portfolioItems.map(item => (
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
                                onClick={() => handleDeletePortfolio(item._id)}
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
