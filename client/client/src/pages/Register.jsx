import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await registerAPI({ name, email, password });
      login(res);

      const isAdmin = res.role === 'admin' || res.email === 'admin@designcraft.com';
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');

      setMessage('✅ Registration successful!');
      setTimeout(() => navigate(isAdmin ? '/admin' : '/profile'), 1000);
    } catch (error) {
      setMessage(error?.response?.data?.message || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="w-full max-w-md bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl animate-fade-in-down">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 dark:text-yellow-400 mb-6">
          📝 Create an Account
        </h2>

        {message && (
          <p
            className={`text-center mb-4 text-sm font-medium px-4 py-2 rounded-lg ${
              message.includes('success')
                ? 'text-green-700 bg-green-100'
                : 'text-red-700 bg-red-100'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-xl font-semibold transition-all transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white shadow-md'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
          Already have an account?{' '}
          <span
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
