import React, { useEffect, useState } from 'react';

export default function AdminPortfolioList() {
  const [portfolioList, setPortfolioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolio items
  useEffect(() => {
    fetch('http://localhost:5050/api/portfolio')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch portfolio items');
        return res.json();
      })
      .then(data => {
        setPortfolioList(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading portfolio...</p>;
  if (error) return <p className="text-center text-red-600 font-semibold">❌ {error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        🎨 Admin Portfolio List
      </h2>

      {portfolioList.length === 0 ? (
        <p className="text-center text-gray-500">No portfolio items found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioList.map(item => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden group"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  {item.description}
                </p>
                <span className="inline-block mt-2 text-xs bg-yellow-200 text-yellow-800 dark:bg-yellow-400 dark:text-gray-900 font-semibold px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
