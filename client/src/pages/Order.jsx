import { useState, useEffect, useRef } from 'react';
import { placeOrder, fetchServices, applyCoupon } from '../services/api';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt';
import Particles from 'react-tsparticles';

export default function Order() {
  const location = useLocation();
  const bgRef = useRef(null);
  const tiltRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceId: '',
    serviceName: '',
    servicePrice: 0,
    couponCode: '',
  });

  const [services, setServices] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Load data on mount
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setFormData((prev) => ({ ...prev, email }));

    (async () => {
      const serviceData = await fetchServices();
      setServices(serviceData);
      if (location.state?.selectedService) {
        const { _id, title, price } = location.state.selectedService;
        setFormData((prev) => ({
          ...prev,
          serviceId: _id,
          serviceName: title,
          servicePrice: price,
        }));
        setFinalPrice(price);
      }
    })();
  }, [location.state]);

  // Mouse-following background gradient
  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      if (bgRef.current) {
        bgRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(59,130,246,0.3), rgba(29,78,216,0.6))`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // 3D Tilt effect
  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e) => {
    const s = services.find((s) => s._id === e.target.value);
    if (s) {
      setFormData((prev) => ({
        ...prev,
        serviceId: s._id,
        serviceName: s.title,
        servicePrice: s.price,
        couponCode: '',
      }));
      setDiscountPercent(0);
      setFinalPrice(s.price);
      setCouponMessage('');
    }
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) return toast.error('Enter coupon code!');
    try {
      const res = await applyCoupon(formData.couponCode);
      const disc = res.discount;
      const discAmt = Math.round((formData.servicePrice * disc) / 100);
      setDiscountPercent(disc);
      setFinalPrice(formData.servicePrice - discAmt);
      setCouponMessage(`✅ ${disc}% OFF! You save ₹${discAmt}`);
    } catch {
      setDiscountPercent(0);
      setFinalPrice(formData.servicePrice);
      setCouponMessage('❌ Invalid or expired coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await placeOrder({
        clientName: formData.name,
        clientEmail: formData.email,
        serviceId: formData.serviceId,
        serviceName: formData.serviceName,
        servicePrice: finalPrice || formData.servicePrice,
        couponCode: formData.couponCode || null,
        discountPercent: discountPercent || 0,
      });
      setSuccessMessage('✅ Order placed successfully!');
      setFormData({
        name: '',
        email: localStorage.getItem('userEmail') || '',
        serviceId: '',
        serviceName: '',
        servicePrice: 0,
        couponCode: '',
      });
      setDiscountPercent(0);
      setFinalPrice(0);
      setCouponMessage('');
    } catch {
      toast.error('❌ Error placing order.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔥 Mouse-following gradient background */}
      <div
        ref={bgRef}
        className="fixed inset-0 -z-20 transition-all duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(59,130,246,0.3), rgba(29,78,216,0.6))',
        }}
      />

      {/* ✨ Particles trail */}
      <Particles
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 0 },
            color: { value: '#ffffff' },
            links: {
              enable: true,
              distance: 150,
              color: '#ffffff',
              opacity: 0.2,
            },
            move: { enable: true, speed: 1, outMode: 'bounce' },
            size: { value: 2 },
            opacity: { value: 0.4 },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
              resize: true,
            },
          },
        }}
        className="fixed inset-0 -z-10 pointer-events-none"
      />

      {/* 🎨 Glass 3D Order Card */}
      <motion.div
        ref={tiltRef}
        className="relative z-10 max-w-xl mx-auto mt-12 p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-yellow-400">📦 Place Your Order</h2>
        {successMessage && (
          <p className="text-green-600 dark:text-green-400 mb-4 text-center">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-gray-800 dark:text-gray-200">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="👤 Your Name"
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 transition"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="📧 Your Email"
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 transition"
          />
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleServiceChange}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 transition"
          >
            <option value="">📋 Select a Service</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title} — ₹{s.price}
              </option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              name="couponCode"
              value={formData.couponCode}
              onChange={handleChange}
              placeholder="🎁 Coupon Code"
              className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 transition"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <p className={`text-sm ${discountPercent ? 'text-green-600' : 'text-red-600'}`}>{couponMessage}</p>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 text-sm space-y-1">
            <p>💰 <strong>Price:</strong> ₹{formData.servicePrice}</p>
            {discountPercent > 0 && <p>🎉 <strong>Discount:</strong> {discountPercent}%</p>}
            {discountPercent > 0 && (
              <p>💸 <strong>You Save:</strong> ₹{Math.round((formData.servicePrice * discountPercent) / 100)}</p>
            )}
            <p className="text-lg text-green-700 dark:text-green-400 font-semibold">
              Final Price: ₹{finalPrice || formData.servicePrice}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-3 rounded-lg transition font-semibold shadow-md cursor-pointer"
          >
            🚀 Submit Order
          </button>
        </form>
      </motion.div>
    </div>
  );
}
