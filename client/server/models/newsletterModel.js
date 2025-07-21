const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);


// 2️⃣ server/controllers/newsletterController.js
const Newsletter = require('./newsletterModel');

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const exists = await Newsletter.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Already subscribed' });

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
