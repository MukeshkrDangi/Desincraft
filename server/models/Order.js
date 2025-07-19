const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  couponCode: { type: String }, // optional
  discountPercent: { type: Number }, // optional
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], // ✅ Added 'Cancelled'
    default: 'Pending'
  },
  feedback: { type: String },
  voiceNote: { type: String }
}, { timestamps: true }); // adds createdAt & updatedAt fields automatically

module.exports = mongoose.model('Order', orderSchema);
