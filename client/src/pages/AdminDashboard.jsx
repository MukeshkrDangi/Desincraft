// client/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { fetchOrderSummary } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchOrderSummary();
        setStats(data);
      } catch (error) {
        console.error('❌ Failed to load admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  const summaryCards = [
    { title: 'Total Orders', count: stats.totalOrders, color: 'border-blue-500', textColor: 'text-blue-700', icon: '📦' },
    { title: 'Pending', count: stats.pendingOrders, color: 'border-yellow-500', textColor: 'text-yellow-700', icon: '⏳' },
    { title: 'Completed', count: stats.completedOrders, color: 'border-green-600', textColor: 'text-green-800', icon: '✅' },
    { title: 'Cancelled', count: stats.cancelledOrders, color: 'border-red-600', textColor: 'text-red-800', icon: '❌' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <motion.h1
        className="text-4xl font-display font-bold text-primary text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🛠️ Admin Dashboard
      </motion.h1>

      {/* Admin Navigation Links */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/upload"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition-all duration-300 shadow hover:scale-105"
        >
          📤 Upload Portfolio
        </Link>
        <Link
          to="/admin/services"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition-all duration-300 shadow hover:scale-105"
        >
          🪰 Manage Services
        </Link>
        <Link
          to="/admin/portfolio"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full transition-all duration-300 shadow hover:scale-105"
        >
          🖼️ Manage Portfolio
        </Link>
        <Link
          to="/admin/orders"
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full transition-all duration-300 shadow hover:scale-105"
        >
          📁 Manage Orders
        </Link>
      </div>

      {/* Order Summary Cards */}
      {loading ? (
        <p className="text-center text-lg text-gray-600 animate-pulse">⏳ Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map(({ title, count, color, textColor, icon }) => (
            <motion.div
              key={title}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={`bg-white border-l-4 ${color} shadow p-6 rounded-2xl backdrop-blur-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-lg font-semibold ${textColor}`}>{icon} {title}</h2>
              </div>
              <p className="text-3xl font-bold text-gray-800">{count}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
