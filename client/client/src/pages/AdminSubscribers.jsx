import { useEffect, useState } from 'react';
import {
  getSubscribers,
  exportSubscribersToCSV,
  deleteSubscriber
} from '../services/api';
import { toast } from 'react-toastify';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, [page, domain, startDate, endDate]);

  const fetchSubscribers = async () => {
    try {
      const params = {
        page,
        limit,
        domain: domain || undefined,
        start: startDate || undefined,
        end: endDate || undefined,
      };
      const data = await getSubscribers(params);
      setSubscribers(data.subscribers || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('❌ Failed to load subscribers');
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        domain: domain || undefined,
        start: startDate || undefined,
        end: endDate || undefined,
      };
      const blob = await exportSubscribersToCSV(params);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscribers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('❌ Export failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to unsubscribe this user?')) {
      try {
        await deleteSubscriber(id);
        toast.success('✅ Subscriber removed');
        fetchSubscribers();
      } catch (err) {
        toast.error('❌ Failed to unsubscribe');
      }
    }
  };

  const filtered = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
          📬 Subscribers{' '}
          <span className="text-sm bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded-full ml-2">
            {filtered.length} shown
          </span>
        </h2>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-transform hover:scale-105"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="text"
          placeholder="Filter by domain (e.g. gmail.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg border dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 border dark:border-gray-700">#</th>
              <th className="p-3 border dark:border-gray-700">Email</th>
              <th className="p-3 border dark:border-gray-700">Subscribed On</th>
              <th className="p-3 border text-center dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No subscribers found.
                </td>
              </tr>
            ) : (
              filtered.map((sub, index) => (
                <tr
                  key={sub._id}
                  className="hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-150"
                >
                  <td className="p-3 border dark:border-gray-700 text-center font-medium">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="p-3 border dark:border-gray-700">{sub.email}</td>
                  <td className="p-3 border text-center dark:border-gray-700">
                    {sub.subscribedAt
                      ? new Date(sub.subscribedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="p-3 border text-center dark:border-gray-700">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="text-red-600 dark:text-red-400 hover:underline hover:text-red-800 dark:hover:text-red-300"
                    >
                      🗑️ Unsubscribe
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4 text-sm">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
