// 📁 client/src/pages/MyOrders.jsx
import { useEffect, useState } from 'react';
import { fetchClientOrders } from '../services/api';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    const fetchOrders = async () => {
      const res = await fetchClientOrders(email);
      setOrders(res);
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-yellow-400 mb-6">
        📦 My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-lg">You haven't placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="min-w-full text-sm sm:text-base text-left text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800 uppercase">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Original</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Final Price</th>
                <th className="px-4 py-3">Coupon</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const original = Number(order.servicePrice);
                const discount = order.discountPercent || 0;
                const finalPrice = (original - (original * discount) / 100).toFixed(2);

                return (
                  <tr
                    key={order._id}
                    className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    <td className="px-4 py-3 font-semibold text-blue-700 dark:text-yellow-300">{order.serviceName}</td>
                    <td className="px-4 py-3">₹{original}</td>
                    <td className="px-4 py-3">
                      {discount ? `${discount}%` : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-700 dark:text-green-400">
                      ₹{discount ? finalPrice : original}
                    </td>
                    <td className="px-4 py-3">
                      {order.couponCode || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-1 rounded font-medium text-xs sm:text-sm ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-white'
                            : order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-600 dark:text-white'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      {order.feedback ? (
                        <span className="text-green-600 italic dark:text-green-400">Submitted</span>
                      ) : (
                        <Link
                          to={`/feedback/${order._id}`}
                          className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-3 py-1 rounded transition text-sm shadow-md"
                        >
                          ✍️ Give Feedback
                        </Link>
                      )}
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
