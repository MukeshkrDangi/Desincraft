import { createContext, useContext, useState } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error('❌ Failed to parse user from localStorage:', err);
      return null;
    }
  });

  // ✅ Login: store user in state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // ✅ Store user email separately for MyOrders
    if (userData?.email) {
      localStorage.setItem('userEmail', userData.email);
    }
  };

  // ✅ Logout: clear state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail'); // ✅ clear userEmail on logout too
  };

  // ✅ Auth utilities
  const isAuthenticated = !!user;

  // 🔐 Updated admin check: fallback to known admin email
  const isAdmin =
    user?.role === 'admin' ||
    user?.email === 'admin@designcraft.com' ||
    user?.email === 'mukeshkrdangi1@gmail.com';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Access context with this hook
export const useAuth = () => useContext(AuthContext);
