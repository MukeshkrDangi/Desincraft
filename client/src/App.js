import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Order from './pages/Order';
import MyOrders from './pages/MyOrders';
import Feedback from './pages/Feedback';
import UnsubscribeSuccess from './pages/UnsubscribeSuccess';
import SketchMindFeedback from './pages/SketchMindFeedback';

import AdminDashboard from './pages/AdminDashboard';
import ServicesManager from './pages/ServicesManager';
import PortfolioManager from './pages/PortfolioManager';
import AdminOrders from './pages/AdminOrders';
import AdminCouponManager from './pages/AdminCouponManager';
import AdminSubscribers from './pages/AdminSubscribers';
import AdminCampaign from './pages/AdminCampaign';
import AdminBannerManager from './pages/AdminBannerManager';
import AdminFeedback from './pages/AdminFeedback';
import AdminSketchMindFeedbacks from './pages/AdminSketchMindFeedbacks';

import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/sketchmind" element={<SketchMindFeedback />} />
          <Route path="/unsubscribe" element={<UnsubscribeSuccess />} />

          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/:orderId"
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            }
          />

          {/* Admin-Only Routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute adminOnly>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute adminOnly>
                <ServicesManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/portfolio"
            element={
              <ProtectedRoute adminOnly>
                <PortfolioManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute adminOnly>
                <AdminCouponManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscribers"
            element={
              <ProtectedRoute adminOnly>
                <AdminSubscribers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/campaign"
            element={
              <ProtectedRoute adminOnly>
                <AdminCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute adminOnly>
                <AdminBannerManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-feedback"
            element={
              <ProtectedRoute adminOnly>
                <AdminFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sketchmind-feedbacks"
            element={
              <ProtectedRoute adminOnly>
                <AdminSketchMindFeedbacks />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={<h1 className="text-center text-2xl mt-20">404 - Page Not Found</h1>}
          />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </main>
      <Footer />
    </div>
  );
}
