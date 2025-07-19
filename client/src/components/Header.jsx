import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars, FaTimes, FaChevronDown, FaBell, FaShoppingCart,
  FaUserCircle, FaMoon, FaSun
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { logout, isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAdminDropdown(false);
    setUserDropdown(false);
  };

  return (
    <motion.header
      className="bg-white dark:bg-gray-900 backdrop-blur-md sticky top-0 z-50 shadow border-b border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-slate-800 dark:text-white">
          <span className="text-yellow-500">Design</span>Craft
        </Link>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4 text-xl">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-800 dark:text-white">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:shadow-none shadow-md md:items-center gap-4 md:gap-6 px-6 py-4 md:py-0 z-40`}
        >
          <HeaderLink label="Home" to="/" onClick={closeMenu} />
          <HeaderLink label="Portfolio" to="/portfolio" onClick={closeMenu} />
          <HeaderLink label="Contact" to="/contact" onClick={closeMenu} />
          <HeaderLink label="Place Order" to="/order" onClick={closeMenu} />
          <HeaderLink label="SketchMind" to="/sketchmind" onClick={closeMenu} />

          {!isAuthenticated && (
            <>
              <HeaderLink label="Login" to="/login" onClick={closeMenu} />
              <HeaderLink label="Register" to="/register" onClick={closeMenu} />
            </>
          )}

          {isAuthenticated && isAdmin && (
            <div className="relative">
              <button
                onClick={() => setAdminDropdown(!adminDropdown)}
                className="flex items-center gap-1 text-slate-800 dark:text-white font-medium hover:text-yellow-500"
              >
                Admin <FaChevronDown className="text-xs" />
              </button>
              <AnimatePresence>
                {adminDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow z-50"
                  >
                    {[
                      { label: 'Dashboard', to: '/admin' },
                      { label: 'Orders', to: '/admin/orders' },
                      { label: 'Services', to: '/admin/services' },
                      { label: 'Coupons', to: '/admin/coupons' },
                      { label: 'Subscribers', to: '/admin/subscribers' },
                      { label: 'Campaigns', to: '/admin/campaign' },
                      { label: 'Upload Portfolio', to: '/upload' },
                      { label: 'Mockup Generator', to: '/mockup' },
                      { label: 'Banner Manager', to: '/admin/banners' },
                      { label: 'SketchMind', to: '/sketchmind' }, // ✅ Added for admin
                        { label: 'SketchMind Feedbacks', to: '/admin/sketchmind-feedbacks' },
                    ].map(({ label, to }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={closeMenu}
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-600"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {isAuthenticated && !isAdmin && (
            <>
              <HeaderLink label="Profile" to="/profile" onClick={closeMenu} />
              <HeaderLink label="My Orders" to="/my-orders" onClick={closeMenu} />
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Desktop Right - Avatar and Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setUserDropdown(!userDropdown)}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <FaUserCircle className="text-slate-800 dark:text-white text-2xl" />
              )}
            </button>
            <AnimatePresence>
              {userDropdown && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow z-50"
                >
                  <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    className="px-4 py-3 border-b dark:border-gray-700 flex items-center gap-3"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <FaUserCircle className="text-slate-800 dark:text-white text-3xl" />
                    )}
                    <div>
                      <p className="font-medium text-sm text-slate-800 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    className="px-4 py-2 border-b dark:border-gray-700 flex justify-between"
                  >
                    <button
                      onClick={toggleDarkMode}
                      className="text-slate-800 dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {darkMode ? <FaSun /> : <FaMoon />}
                    </button>
                    <div className="relative p-2 text-slate-800 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaBell />
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded-full">
                        3
                      </span>
                    </div>
                    <div className="relative p-2 text-slate-800 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaShoppingCart />
                      <span className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] px-1 rounded-full">
                        1
                      </span>
                    </div>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-600"
                    >
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <Link
                      to="/my-orders"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-600"
                    >
                      My Orders
                    </Link>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function HeaderLink({ label, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-slate-800 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 font-medium transition"
    >
      {label}
    </Link>
  );
}
