import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Header from '../components/Header';
import {
  fetchSubscriberAnalytics,
  getAIGeneratedNewsletter,
  sendCampaignEmail,
} from '../services/api';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminCampaign = () => {
  const [analytics, setAnalytics] = useState([]);
  const [range, setRange] = useState('daily');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState('');

  const loadAnalytics = useCallback(async () => {
    try {
      const data = await fetchSubscriberAnalytics(range);
      if (Array.isArray(data)) {
        setAnalytics(data);
      } else {
        toast.error('Invalid analytics format');
        setAnalytics([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load analytics');
    }
  }, [range]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error loading campaigns:', err);
    }
  }, []);

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5050/api/campaigns', { title: newCampaign });
      setCampaigns((prev) => [...prev, res.data]);
      setNewCampaign('');
    } catch (err) {
      console.error('Error adding campaign:', err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const suggestion = await getAIGeneratedNewsletter();
      if (suggestion?.subject && suggestion?.summary) {
        setSubject(suggestion.subject);
        setContent(suggestion.summary);
      } else {
        toast.warning('Incomplete AI response');
      }
    } catch (err) {
      console.error(err);
      toast.error('AI suggestion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      return toast.warning('Subject and content are required');
    }
    try {
      await sendCampaignEmail(subject.trim(), content.trim());
      toast.success('Campaign sent!');
      setSubject('');
      setContent('');
    } catch (err) {
      console.error('Send failed:', err);
      toast.error('Failed to send campaign');
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <Header title="📢 Campaign Dashboard" />

      {/* Analytics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📈 Subscriber Growth</h2>
        <div className="flex items-center mb-4 gap-4">
          <label htmlFor="range" className="font-semibold">Range:</label>
          <select
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign AI Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">✉️ Send Newsletter Campaign</h2>
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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Generating...' : '🧠 Generate with AI'}
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

      {/* Campaign List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📚 All Campaigns</h2>
        <form onSubmit={handleAddCampaign} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCampaign}
            onChange={(e) => setNewCampaign(e.target.value)}
            placeholder="New Campaign Title"
            className="border p-2 rounded w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            ➕ Add
          </button>
        </form>

        <ul className="space-y-2">
          {campaigns.map((campaign) => (
            <li key={campaign._id} className="border p-2 rounded shadow">
              {campaign.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCampaign;
