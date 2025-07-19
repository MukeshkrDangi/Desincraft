import { useState, useEffect } from 'react';
import { fetchServices, addService, deleteService, updateService } from '../services/api';
import { Link } from 'react-router-dom';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = '🛠️ Services Manager';
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await fetchServices();
    setServices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await updateService(editingServiceId, { title, description });
        setMessage('✅ Service updated successfully!');
      } else {
        await addService({ title, description });
        setMessage('✅ Service added successfully!');
      }
      setTitle('');
      setDescription('');
      setEditingServiceId(null);
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      setMessage('❌ Failed to save service.');
    }
  };

  const handleEdit = (service) => {
    setEditingServiceId(service._id);
    setTitle(service.title);
    setDescription(service.description);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        setMessage('✅ Service deleted successfully!');
        loadServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        setMessage('❌ Failed to delete service.');
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-glass animate-fade-in-down">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-700 dark:text-yellow-400">
            🛠️ Services Manager
          </h1>

          {/* Admin Navigation */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Link
              to="/admin"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/upload"
              className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
            >
              Upload Portfolio
            </Link>
          </div>

          {message && (
            <p className="mb-4 text-sm font-medium text-green-700 bg-green-100 px-4 py-2 rounded-lg shadow">
              {message}
            </p>
          )}

          {/* Service Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
            <input
              type="text"
              placeholder="Service Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Service Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-transform transform hover:scale-105 shadow"
            >
              {editingServiceId ? 'Update Service' : 'Add Service'}
            </button>
          </form>

          {/* Service List */}
          <h2 className="text-2xl font-semibold text-indigo-700 dark:text-white mb-4">
            Available Services
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.length === 0 ? (
              <p className="text-gray-500">No services available.</p>
            ) : (
              services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <h3 className="text-lg font-bold text-indigo-800 dark:text-yellow-300 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{service.description}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-xl transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-xl transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
