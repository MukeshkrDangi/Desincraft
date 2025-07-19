import { motion } from 'framer-motion';

export default function PortfolioCard({ item }) {
    return (
        <motion.div 
            className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
        >
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-gray-600">{item.description}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {item.category}
            </span>
        </motion.div>
    );
}
