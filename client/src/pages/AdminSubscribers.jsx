import React, { useEffect, useState, useCallback } from 'react';
import {
  getSubscribers,
  exportSubscribersToCSV,
  deleteSubscriber
} from '../services/api';
import { toast } from 'react-toastify';
import Header from '../components/Header';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setPage(1);
  }, [search, domain, startDate, endDate]);

  const fetchSubscribers = useCallback(async () => {
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
      console.error('Failed to load subscribers:', err);
      toast.error('❌ Failed to load subscribers');
    }
  }, [page, domain, startDate, endDate, limit]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

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
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
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
        console.error('Failed to unsubscribe:', err);
        toast.error('❌ Failed to unsubscribe');
      }
    }
  };

  const filtered = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-100">
      <Header title="Admin Subscribers" />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-xl font-semibold">
          Showing {filtered.length} subscribers
        </div>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No subscribers found.
              </td>
            </tr>
          ) : (
            filtered.map((sub, index) => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{(page - 1) * limit + index + 1}</td>
                <td className="p-2 border">{sub.email}</td>
                <td className="p-2 border text-center">
                  {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Unsubscribe
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-6 flex justify-center items-center gap-4 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default AdminSubscribers;
