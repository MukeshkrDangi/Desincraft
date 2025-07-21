import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars, FaTimes, FaChevronDown, FaBell, FaShoppingCart,
  FaUserCircle, FaMoon, FaSun,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ title }) {
  const { logout, isAuthenticated, isAdmin, user } = useAuth();

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
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAdminDropdown(false);
    setUserDropdown(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    closeMenu();
  };

  return (
    <>
      {/* Navbar */}
      <motion.header
        className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow border-b border-gray-200 dark:border-gray-700 backdrop-blur-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-slate-800 dark:text-white">
            <span className="text-yellow-500">Design</span>Craft
          </Link>

          {/* Mobile menu toggle */}
          <div className="md:hidden text-xl">
            <button onClick={toggleMenu} className="text-slate-800 dark:text-white" aria-label="Toggle menu">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 shadow-md md:shadow-none px-6 py-4 md:py-0 gap-4 md:gap-6 md:items-center z-50`}
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
              <DropdownMenu
                label="Admin"
                isOpen={adminDropdown}
                toggle={() => {
                  setAdminDropdown(!adminDropdown);
                  setUserDropdown(false);
                }}
                close={closeMenu}
                items={[
                  ['Dashboard', '/admin'],
                  ['Orders', '/admin/orders'],
                  ['Services', '/admin/services'],
                  ['Coupons', '/admin/coupons'],
                  ['Subscribers', '/admin/subscribers'],
                  ['Campaigns', '/admin/campaign'],
                  ['Upload Portfolio', '/upload'],
                  ['Mockup Generator', '/mockup'],
                  ['Banner Manager', '/admin/banners'],
                  ['SketchMind', '/sketchmind'],
                  ['SketchMind Feedbacks', '/admin/sketchmind-feedbacks'],
                ]}
              />
            )}

            {isAuthenticated && !isAdmin && (
              <>
                <HeaderLink label="Profile" to="/profile" onClick={closeMenu} />
                <HeaderLink label="My Orders" to="/my-orders" onClick={closeMenu} />
              </>
            )}
          </nav>

          {/* Avatar and dropdown */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-4 relative">
              <button
                onClick={() => {
                  setUserDropdown(!userDropdown);
                  setAdminDropdown(false);
                }}
                aria-haspopup="true"
                aria-expanded={userDropdown}
              >
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow z-50"
                  >
                    <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center gap-3">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                      ) : (
                        <FaUserCircle className="text-slate-800 dark:text-white text-3xl" />
                      )}
                      <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>

                    <div className="px-4 py-2 border-b dark:border-gray-700 flex justify-between">
                      <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
                        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-slate-700 dark:text-white" />}
                      </button>
                      <div className="relative">
                        <FaBell className="text-slate-700 dark:text-white" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">3</span>
                      </div>
                      <div className="relative">
                        <FaShoppingCart className="text-slate-700 dark:text-white" />
                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] px-1 rounded-full">1</span>
                      </div>
                    </div>

                    <Link to="/profile" onClick={closeMenu} className="block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-600">
                      Profile
                    </Link>
                    <Link to="/my-orders" onClick={closeMenu} className="block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-600">
                      My Orders
                    </Link>
                    <button onClick={() => { logout(); closeMenu(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.header>

      {/* Page Title */}
      {title && (
        <div className="max-w-7xl mx-auto px-4 mt-6 mb-4">
          <h1 className="text-2xl font-semibold border-b pb-2 text-slate-800 dark:text-white">
            {title}
          </h1>
        </div>
      )}
    </>
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

function DropdownMenu({ label, toggle, isOpen, close, items }) {
  return (
    <div className="relative">
      <button onClick={toggle} className="flex items-center gap-1 text-slate-800 dark:text-white font-medium hover:text-yellow-500">
        {label} <FaChevronDown className="text-xs" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow z-50"
          >
            {items.map(([text, to]) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                className="block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-600"
              >
                {text}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
