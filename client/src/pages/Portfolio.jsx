import { useState, useEffect, useCallback } from 'react';
import { fetchPortfolio } from '../services/api';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await fetchPortfolio();
        setPortfolioItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const filterItems = useCallback(() => {
    if (!search.trim()) {
      setFilteredItems(portfolioItems);
    } else {
      const query = search.toLowerCase();
      const filtered = portfolioItems.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [search, portfolioItems]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen space-y-12">
      {/* ✅ Heading */}
      <h1 className="text-4xl font-bold text-center text-blue-700" data-aos="fade-down">
        Our Portfolio
      </h1>

      {/* ✅ Search */}
      <div data-aos="fade-up" className="flex justify-center">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ✅ Content */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-gray-500">No portfolio items found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <div
              key={item._id}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-[1.025] hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-300"
                onError={(e) =>
                  (e.target.src = 'https://via.placeholder.com/400x300?text=No+Image')
                }
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-700 mb-1 hover:underline transition">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-xs italic text-gray-500">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
