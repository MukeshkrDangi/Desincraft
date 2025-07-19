import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const bgRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🌀 Mouse-tracking gradient
  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      if (bgRef.current) {
        bgRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(59,130,246,0.3), rgba(168,85,247,0.4))`;
      }
    };

    if (bgRef.current) {
      bgRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3), rgba(168,85,247,0.4))`;
    }

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('http://localhost:5050/api/auth/profile', { name, email }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('✅ Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify({ ...res.data.user, token }));

      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* 🔥 Mouse-tracking background gradient */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 transition-all duration-300 pointer-events-none"
      />

      {/* ✨ Profile Card with glass effect */}
      <div className="w-full max-w-xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-glass p-8 sm:p-10 transition-all">
        <h1 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-300 mb-6">
          👤 My Profile
        </h1>

        {message && (
          <p className="text-center mb-4 text-green-600 dark:text-green-400">{message}</p>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`py-3 text-lg font-semibold rounded-lg text-white transition-transform transform hover:scale-105 shadow-lg ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {loading ? 'Updating...' : '💾 Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
