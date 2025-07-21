// client/src/pages/PortfolioManager.jsx
import { useState, useEffect } from 'react';
import {
  fetchPortfolio,
  deletePortfolio,
  updatePortfolio,
  fetchOrderSummary
} from '../services/api';
import { Link } from 'react-router-dom';

export default function PortfolioManager() {
  const [portfolio, setPortfolio] = useState([]);
  const [message, setMessage] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [summary, setSummary] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0
  });

  useEffect(() => {
    loadPortfolio();
    loadSummary();
  }, []);

  const loadPortfolio = async () => {
    const data = await fetchPortfolio();
    setPortfolio(data);
  };

  const loadSummary = async () => {
    const data = await fetchOrderSummary();
    setSummary(data);
  };

  const handleDelete = async (id) => {
    await deletePortfolio(id);
    setMessage('✅ Portfolio item deleted successfully!');
    loadPortfolio();
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    await updatePortfolio(editingItem._id, {
      title: editTitle,
      description: editDescription
    });

    setMessage('✅ Portfolio item updated successfully!');
    cancelEditing();
    loadPortfolio();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🗂️ Portfolio Manager</h1>

      {/* 🔗 Admin Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300">
          Admin Dashboard
        </Link>
        <Link to="/upload" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300">
          Upload Portfolio
        </Link>
      </div>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-100 p-4 rounded shadow text-center hover:scale-105 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold">📦 Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">{summary.totalOrders}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center hover:scale-105 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold">✅ Completed</h2>
          <p className="text-3xl font-bold text-green-600">{summary.completedOrders}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center hover:scale-105 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold">⏳ Pending</h2>
          <p className="text-3xl font-bold text-yellow-600">{summary.pendingOrders}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center hover:scale-105 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold">❌ Cancelled</h2>
          <p className="text-3xl font-bold text-red-600">{summary.cancelledOrders}</p>
        </div>
      </div>

      {/* ✅ Success Message */}
      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}

      {/* 🎨 Portfolio List */}
      <h2 className="text-2xl font-semibold mb-4">Portfolio Items</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {portfolio.length === 0 ? (
          <p className="text-gray-500">No portfolio items available.</p>
        ) : (
          portfolio.map(item => (
            <div key={item._id} className="border p-4 rounded shadow hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="mb-4 w-full h-40 object-cover rounded hover:scale-105 transition-transform duration-300"
                />
              )}
              <p className="mb-4 text-gray-700">{item.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(item)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition-all duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✏️ Edit Form */}
      {editingItem && (
        <div className="mt-10 p-6 bg-gray-100 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Edit Portfolio Item</h2>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
              >
                Update
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
