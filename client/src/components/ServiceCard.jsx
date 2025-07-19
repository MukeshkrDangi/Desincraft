import { motion } from 'framer-motion';

export default function ServiceCard({ service }) {
  return (
    <motion.div
      className="group p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-yellow-400"
      whileHover={{ scale: 1.03 }}
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-48 sm:h-52 md:h-56 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-yellow-500 transition">
          {service.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}
