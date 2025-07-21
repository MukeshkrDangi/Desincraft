import { useState, useEffect } from 'react';
import {
  fetchPortfolio,
  createPortfolio,
  deletePortfolio,
  updatePortfolio,
  fetchServices,
  addService,
  deleteService,
  updateService,
} from '../services/api';
import { Link } from 'react-router-dom';

export default function Upload() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [services, setServices] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  const [message, setMessage] = useState('');
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    loadPortfolio();
    loadServices();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await fetchPortfolio();
      setPortfolioItems(data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  };

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await addService({ title: serviceTitle, description: serviceDescription, price: servicePrice });
      setMessage('✅ Service added successfully!');
      setServiceTitle('');
      setServiceDescription('');
      setServicePrice('');
      loadServices();
    } catch (error) {
      console.error('Error adding service:', error);
      setMessage('❌ Failed to add service.');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
      setMessage('✅ Service deleted successfully!');
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage('❌ Failed to delete service.');
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service._id);
    setServiceTitle(service.title);
    setServiceDescription(service.description);
    setServicePrice(service.price);
    setMessage('📝 Editing service...');
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await updateService(editingServiceId, { title: serviceTitle, description: serviceDescription, price: servicePrice });
      setMessage('✅ Service updated successfully!');
      setServiceTitle('');
      setServiceDescription('');
      setServicePrice('');
      setEditingServiceId(null);
      loadServices();
    } catch (error) {
      console.error('Error updating service:', error);
      setMessage('❌ Failed to update service.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (editingPortfolioId) {
      try {
        await updatePortfolio(editingPortfolioId, { title, description, category, image });
        setMessage('✅ Portfolio item updated successfully!');
        resetForm();
        loadPortfolio();
        e.target.reset();
      } catch (error) {
        console.error('Error updating portfolio item:', error);
        setMessage('❌ Failed to update portfolio item.');
      }
    } else {
      if (!image) {
        setMessage('❌ Please select an image.');
        return;
      }

      if (!image.type.startsWith('image/')) {
        setMessage('❌ Only image files are allowed.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('image', image);

      try {
        await createPortfolio(formData);
        setMessage('✅ Portfolio item uploaded successfully!');
        resetForm();
        e.target.reset();
        loadPortfolio();
      } catch (error) {
        console.error('Error uploading portfolio:', error);
        setMessage('❌ Failed to upload portfolio item.');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePortfolio(id);
      setMessage('✅ Portfolio item deleted successfully!');
      loadPortfolio();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      setMessage('❌ Failed to delete portfolio item.');
    }
  };

  const handleEdit = (item) => {
    setEditingPortfolioId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setImage(null);
    setMessage('📝 Editing portfolio item...');
  };

  const resetForm = () => {
    setEditingPortfolioId(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">📤 Upload & Manage Portfolio</h1>

      <div className="flex gap-4 mb-6 justify-center flex-wrap">
        <Link to="/admin" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition">Admin Panel</Link>
        <Link to="/upload" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition">Upload Portfolio</Link>
      </div>

      {message && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 border border-green-300 rounded shadow">{message}</div>
      )}

      {/* Service Form */}
      <form onSubmit={editingServiceId ? handleUpdateService : handleAddService} className="bg-gray-50 p-6 rounded-xl mb-12 shadow">
        <h2 className="text-2xl font-semibold mb-4">{editingServiceId ? '✏️ Edit Service' : '➕ Add New Service'}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="Service Title" value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} className="border p-2 rounded w-full" required />
          <input type="number" placeholder="Service Price" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <textarea placeholder="Service Description" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} className="border p-2 rounded w-full mb-4" rows={3} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{editingServiceId ? 'Update Service' : 'Add Service'}</button>
      </form>

      {/* Service Cards */}
      <h2 className="text-2xl font-semibold mb-4">🛠️ Available Services</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {services.length === 0 ? (
          <p className="text-gray-500">No services added yet.</p>
        ) : (
          services.map(service => (
            <div key={service._id} className="border p-4 rounded-lg shadow hover:shadow-md hover:scale-[1.02] transition-all">
              <h3 className="text-xl font-bold text-primary mb-1">{service.title}</h3>
              <p className="mb-2 text-sm text-gray-700">{service.description}</p>
              <p className="text-sm text-gray-600 mb-3">Price: ₹{service.price}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEditService(service)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDeleteService(service._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Portfolio Upload Form */}
      <form onSubmit={handleUpload} className="bg-gray-50 p-6 rounded-xl mb-12 shadow">
        <h2 className="text-2xl font-semibold mb-4">{editingPortfolioId ? '✏️ Edit Portfolio' : '🖼️ Upload Portfolio'}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="Portfolio Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded w-full" required />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <textarea placeholder="Portfolio Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded w-full mb-4" rows={4} required />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="border p-2 rounded w-full mb-4" />
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">{editingPortfolioId ? 'Update Portfolio' : 'Upload Portfolio'}</button>
      </form>

      {/* Portfolio Items */}
      <h2 className="text-2xl font-semibold mb-4">🗂️ Uploaded Portfolio</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 pb-16">
        {portfolioItems.length === 0 ? (
          <p className="text-gray-500">No portfolio items uploaded yet.</p>
        ) : (
          portfolioItems.map(item => (
            <div key={item._id} className="border rounded-lg shadow p-4 hover:shadow-md hover:scale-[1.02] transition-all">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded mb-3 hover:opacity-90 transition" />
              )}
              <h3 className="text-lg font-bold text-primary">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-xs text-gray-500 mb-3">{item.category}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
