const Subscriber = require('../models/subscriberModel');
const { Parser } = require('json2csv');

// ✅ Get Subscribers with optional filters (domain, start/end date, pagination)
const getSubscribers = async (req, res) => {
  const { page = 1, limit = 10, domain, start, end } = req.query;
  const filters = {};

  if (domain) {
    filters.email = { $regex: `@${domain}$`, $options: 'i' };
  }

  if (start || end) {
    filters.subscribedAt = {};
    if (start) filters.subscribedAt.$gte = new Date(start);
    if (end) filters.subscribedAt.$lte = new Date(end);
  }

  try {
    const total = await Subscriber.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);
    const subscribers = await Subscriber.find(filters)
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      subscribers,
      totalPages,
      total,
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
};

// ✅ Export Subscribers to CSV
const exportSubscribers = async (req, res) => {
  const { domain, start, end } = req.query;
  const filters = {};

  if (domain) {
    filters.email = { $regex: `@${domain}$`, $options: 'i' };
  }

  if (start || end) {
    filters.subscribedAt = {};
    if (start) filters.subscribedAt.$gte = new Date(start);
    if (end) filters.subscribedAt.$lte = new Date(end);
  }

  try {
    const subscribers = await Subscriber.find(filters, 'email subscribedAt');
    const fields = ['email', 'subscribedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(subscribers);

    res.header('Content-Type', 'text/csv');
    res.attachment('subscribers.csv');
    res.send(csv);
  } catch (err) {
    console.error('❌ Export error:', err);
    res.status(500).json({ message: 'Failed to export subscribers' });
  }
};

module.exports = { getSubscribers, exportSubscribers };
