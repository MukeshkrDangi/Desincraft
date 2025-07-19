// ✅ client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);


// ✅ Your existing Header.jsx is already perfect.
// It toggles dark mode correctly and stores preference in localStorage.
// ✅ Your App.jsx is also perfect.
// ✅ You just needed to fix index.css and tailwind.config.js as shown above.

// 🎉 Now dark mode works smoothly across all devices and persists preference!
