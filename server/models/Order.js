const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  couponCode: { type: String, default: null }, // optional
  discountPercent: { type: Number, default: 0 }, // optional
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  feedback: { type: String, default: null },
  voiceNote: { type: String, default: null }
}, { timestamps: true }); // createdAt & updatedAt

module.exports = mongoose.model('Order', orderSchema);
