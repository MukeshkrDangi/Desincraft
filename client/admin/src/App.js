import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Admin from './components/Admin';
import Upload from './components/Upload';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';





export default function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-6">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
