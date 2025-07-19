import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <div
            className="h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center bg-black/60 p-8 rounded-lg"
            >
                <h1 className="text-5xl font-bold mb-4">Welcome to DesignCraft</h1>
                <p className="text-xl mb-6">Showcasing creative design and portfolios with style.</p>
                <Link to="/portfolio" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded text-lg">
                    View Portfolio
                </Link>
            </motion.div>
        </div>
    );
}
