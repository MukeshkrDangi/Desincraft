import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Admin from './components/Admin';
import Upload from './components/Upload';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import AdminOrders from './pages/AdminOrders';
import Order from './pages/Order';

export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/order" element={<Order />} /> {/* ✅ Place Order Route */}
            </Routes>
        </AnimatePresence>
    );
}
