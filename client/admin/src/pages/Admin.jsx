import { useState, useEffect } from 'react';
import { fetchServices, addService, deleteService, updateService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../components/AdminNavigation';

export default function Admin() {
    const [services, setServices] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await fetchServices();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await updateService(editingId, { title, description, imageUrl });
                setMessage('✅ Service updated successfully!');
                setEditingId(null);
            } else {
                await addService({ title, description, imageUrl });
                setMessage('✅ Service uploaded successfully!');
            }

            setTitle('');
            setDescription('');
            setImageUrl('');
            loadServices();
        } catch (error) {
            console.error('Error submitting service:', error);
            setMessage('❌ Failed to submit service');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteService(id);
            setMessage('✅ Service deleted successfully!');
            loadServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            setMessage('❌ Failed to delete service');
        }
        setLoading(false);
    };

    const handleEdit = (service) => {
        setEditingId(service._id);
        setTitle(service.title);
        setDescription(service.description);
        setImageUrl(service.imageUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Admin Panel – Manage Services</h1>

            {/* ✅ Admin Navigation */}
            <AdminNavigation />

            {message && <p className="mb-4 text-green-600">{message}</p>}
            {loading && <p className="mb-4 text-blue-600">Loading...</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
                <input type="text" placeholder="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />
                <textarea placeholder="Service Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border p-2 rounded" required />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    {loading ? 'Processing...' : editingId ? 'Update Service' : 'Upload Service'}
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4">Uploaded Services</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {services.length === 0 ? (
                    <p className="text-gray-500">No services uploaded yet.</p>
                ) : (
                    services.map(service => (
                        <div key={service._id} className="border p-4 rounded shadow">
                            <img src={service.imageUrl} alt={service.title} className="w-full h-48 object-cover mb-4 rounded" />
                            <h3 className="text-xl font-bold">{service.title}</h3>
                            <p className="mb-2">{service.description}</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(service)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
                                <button onClick={() => handleDelete(service._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
