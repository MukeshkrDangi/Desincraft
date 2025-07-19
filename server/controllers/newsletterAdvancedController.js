const Subscriber = require('../models/subscriberModel');

const formatDate = (date) => date.toISOString().split('T')[0];

const getSubscriberAnalytics = async (req, res) => {
  const range = req.query.range || 'daily';

  try {
    const subscribers = await Subscriber.find({}, 'subscribedAt');
    const counts = {};

    subscribers.forEach((sub) => {
      const date = new Date(sub.subscribedAt);
      const key = range === 'weekly'
        ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
        : formatDate(date);

      counts[key] = (counts[key] || 0) + 1;
    });

    const result = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(result);
  } catch (err) {
    console.error('📊 Analytics error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

const sendNewsletterCampaign = async (req, res) => {
  const { subject, content } = req.body;
  if (!subject || !content)
    return res.status(400).json({ message: 'Subject and content are required' });

  try {
    console.log(`📧 Subject: ${subject}`);
    console.log(`📝 Content: ${content}`);
    res.status(200).json({ message: 'Campaign sent successfully' });
  } catch (err) {
    console.error('❌ Campaign error:', err);
    res.status(500).json({ message: 'Failed to send campaign' });
  }
};

const getAIGeneratedNewsletter = async (req, res) => {
  try {
    const aiResult = {
      subject: '🔥 5 Design Trends Dominating 2025',
      summary: 'Discover the top design trends in typography, layout, color theory, and motion that are redefining brand storytelling in 2025.',
    };
    res.status(200).json(aiResult);
  } catch (err) {
    console.error('🤖 AI error:', err);
    res.status(500).json({ message: 'AI generation failed' });
  }
};

module.exports = {
  getSubscriberAnalytics,
  sendNewsletterCampaign,
  getAIGeneratedNewsletter,
};

