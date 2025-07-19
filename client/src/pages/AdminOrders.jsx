import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5050/api/orders');
      setOrders(data);
    } catch (error) {
      toast.error('❌ Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (filter !== 'All') {
      filtered = filtered.filter(order => order.status === filter);
    }

    if (search.trim()) {
      filtered = filtered.filter(order =>
        order.clientName.toLowerCase().includes(search.toLowerCase()) ||
        order.clientEmail.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setDisplayOrders(filtered);
  }, [orders, filter, search, sortOrder]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5050/api/orders/${orderId}/status`, { status: newStatus });
      toast.success('✅ Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('❌ Failed to update status');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:5050/api/orders/${orderId}`);
      toast.success('✅ Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error('❌ Failed to delete order');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">📋 Admin Orders</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Sort By</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Search</label>
          <input
            type="text"
            placeholder="🔍 Name or Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>
      ) : displayOrders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No orders found.</p>
      ) : (
        <div className="overflow-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Coupon</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Feedback</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((order) => {
                const finalPrice = order.discountPercent
                  ? order.servicePrice - Math.round(order.servicePrice * order.discountPercent / 100)
                  : order.servicePrice;

                return (
                  <tr key={order._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap">{order.clientName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{order.clientEmail}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{order.serviceName}</td>
                    <td className="px-4 py-3">
                      ₹{order.servicePrice}
                      {order.discountPercent && (
                        <div className="text-xs text-green-500">
                          -{order.discountPercent}% → ₹{finalPrice}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.couponCode ? (
                        <div className="text-xs">
                          <span className="font-semibold">{order.couponCode}</span>
                          <div className="text-green-600">{order.discountPercent}%</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No Coupon</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 max-w-xs whitespace-normal">
                      {order.feedback ? (
                        <div>
                          <p className="text-sm mb-1">{order.feedback}</p>
                          {order.voiceNote && (
                            <div>
                              <audio controls className="w-full">
                                <source src={order.voiceNote} />
                                Your browser does not support audio.
                              </audio>
                              <a href={order.voiceNote} download className="text-blue-500 text-xs underline">
                                ⬇ Download Note
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No feedback</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}