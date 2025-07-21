// 📁 server/routes/newsletterRoutes.js
const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriberModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {
  getSubscribers,
  exportSubscribers,
} = require('../controllers/newsletterController');

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Subscribe to newsletter
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Already subscribed' });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const unsubscribeLink = `http://localhost:3000/unsubscribe?token=${token}`;

    await transporter.sendMail({
      from: `"DesignCraft Newsletter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to DesignCraft Newsletter!',
      html: `
        <h3>Thanks for subscribing!</h3>
        <p>Expect creative updates and design insights soon.</p>
        <p>If you wish to unsubscribe, click below:</p>
        <a href="${unsubscribeLink}" style="color:red;">Unsubscribe</a><br/><br/>
        <strong>– Team DesignCraft</strong>
      `,
    });

    res.status(200).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('❌ Newsletter subscription error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes
router.get('/', getSubscribers);
router.get('/export', exportSubscribers);
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Subscriber.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Error deleting subscriber' });
  }
});

router.get('/unsubscribe/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const deleted = await Subscriber.findOneAndDelete({ email: decoded.email });
    if (!deleted) return res.status(404).json({ message: 'Already unsubscribed or not found' });
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('❌ Unsubscribe error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
