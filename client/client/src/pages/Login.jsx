import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        'http://localhost:5050/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      login(data);
      setMessage('✅ Login successful!');
      setTimeout(() => navigate(data.role === 'admin' ? '/admin' : '/profile'), 1000);
    } catch (error) {
      console.error('❌ Login error:', error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md bg-white/80 dark:bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 animate-fade-in-down">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 dark:text-yellow-400 mb-6">
          🔐 Welcome Back to <span className="text-indigo-600 dark:text-white">DesignCraft</span>
        </h2>

        {message && (
          <p
            className={`text-center text-sm font-medium mb-4 ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white shadow-md'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
