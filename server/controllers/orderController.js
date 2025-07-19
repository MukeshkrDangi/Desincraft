const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');

// Create Order & Send Confirmation Email
const createOrder = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      serviceId,
      serviceName,
      servicePrice,
      couponCode,
      discountPercent
    } = req.body;

    const newOrder = new Order({
      clientName,
      clientEmail,
      serviceId,
      serviceName,
      servicePrice,
      couponCode: couponCode || null,
      discountPercent: discountPercent || 0,
    });

    await newOrder.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `DesignCraft <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: '✅ Order Confirmation - DesignCraft',
      html: `
        <h2>Thank you for your order, ${clientName}!</h2>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Price:</strong> ₹${servicePrice}</p>
        ${couponCode ? `<p><strong>Coupon:</strong> ${couponCode} (${discountPercent}% OFF)</p>` : ''}
        <p>We’ll get in touch with you soon. You can reply to this email for any queries.</p>
        <br />
        <p>– Team DesignCraft</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('❌ Email Error:', error);
      else console.log('📧 Email sent:', info.response);
    });

    res.status(201).json({ message: '✅ Order placed and email sent', newOrder });
  } catch (error) {
    console.error('❌ Backend Error:', error);
    res.status(500).json({ message: '❌ Failed to place order', error: error.message });
  }
};

// Get Orders by Client Email
const getClientOrders = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ clientEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch client orders', error: error.message });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: '❌ Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch order', error: error.message });
  }
};

// Submit Feedback (optional voice note)
const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: '❌ Order not found' });

    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);

      const stats = fs.statSync(filePath);
      const maxSize = 5 * 1024 * 1024; // 5MB max
      if (stats.size > maxSize) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: '❌ Voice note exceeds 5MB limit' });
      }

      let durationInSeconds;
      try {
        durationInSeconds = await getAudioDurationInSeconds(filePath);
      } catch (err) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: '❌ Invalid or unreadable audio file' });
      }

      if (durationInSeconds > 180) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: '❌ Voice note exceeds 3-minute limit' });
      }

      const voiceNoteUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      order.voiceNote = voiceNoteUrl;
    }

    order.feedback = req.body.feedback || order.feedback;
    await order.save();

    res.status(200).json({ message: '✅ Feedback submitted successfully', order });
  } catch (error) {
    console.error('❌ Feedback Error:', error);
    res.status(500).json({ message: '❌ Failed to submit feedback', error: error.message });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) return res.status(404).json({ message: '❌ Order not found' });
    res.status(200).json({ message: '✅ Status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to update status', error: error.message });
  }
};

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch all orders', error: error.message });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: '❌ Order not found' });
    res.status(200).json({ message: '✅ Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to delete order', error: error.message });
  }
};

// Admin Dashboard Summary
const getOrderSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    const totalFeedback = await Order.countDocuments({ feedback: { $ne: null } });

    res.status(200).json({
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalFeedback,
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch summary', error: error.message });
  }
};

module.exports = {
  createOrder,
  getClientOrders,
  getOrderById,
  submitFeedback,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getOrderSummary,
};
