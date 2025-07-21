import { useState, useEffect } from 'react';
import { placeOrder, fetchServices } from '../services/api';

export default function OrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: ''
  });

  const [services, setServices] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const getServices = async () => {
      const data = await fetchServices();
      setServices(data);
    };
    getServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      name: formData.name,
      email: formData.email,
      service: formData.service
    };

    try {
      await placeOrder(orderData);
      setSuccessMessage('✅ Order placed successfully!');
      setFormData({ name: '', email: '', service: '' });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all">
      <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-white/30 dark:border-gray-700 shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-300 mb-6">
          📝 Place Your Order
        </h2>

        {successMessage && (
          <p className="text-green-600 dark:text-green-400 text-center mb-4 font-medium animate-fade">
            {successMessage}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-gray-800 dark:text-gray-200"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="👤 Your Name"
            required
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="📧 Your Email"
            required
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="">🛠️ Select a Service</option>
            {services.map((service) => (
              <option key={service._id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-transform hover:scale-105 shadow-lg"
          >
            🚀 Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}
