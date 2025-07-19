import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  sendCampaignEmail,
  getAIGeneratedNewsletter,
  fetchSubscriberAnalytics,
} from '../services/api';
import { toast } from 'react-toastify';

export default function AdminCampaign() {
  const [analytics, setAnalytics] = useState([]);
  const [range, setRange] = useState('daily');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = async () => {
    try {
      const data = await fetchSubscriberAnalytics(range);
      // ✅ Defensive check to ensure it's an array
      if (Array.isArray(data)) {
        setAnalytics(data);
      } else {
        setAnalytics([]); // fallback to empty array
        toast.error('Analytics format invalid');
      }
    } catch {
      toast.error('Failed to load analytics');
      setAnalytics([]); // fallback to prevent crash
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const suggestion = await getAIGeneratedNewsletter();
      setSubject(suggestion.subject);
      setContent(suggestion.summary);
    } catch {
      toast.error('AI suggestion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!subject || !content) return toast.warning('Subject and content required');
    try {
      await sendCampaignEmail(subject, content);
      toast.success('Campaign sent');
    } catch {
      toast.error('Failed to send campaign');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📈 Subscriber Growth</h2>
      <div className="flex items-center mb-4 gap-4">
        <label className="font-semibold">View:</label>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="border rounded px-2 py-1">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2 className="text-2xl font-bold mt-10 mb-4">✉️ Newsletter Campaign</h2>
      <div className="space-y-3">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          rows={5}
          className="w-full p-2 border rounded"
          placeholder="Newsletter content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Generating...' : '🧠 Suggest with AI'}
          </button>
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📤 Send Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
