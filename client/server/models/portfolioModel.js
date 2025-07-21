// server/models/portfolioModel.js
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Poster', 'Business Card', 'Website', 'Flyer', 'T-Shirt', 'Social Media'],
    default: 'Poster',
  },
  image: {
    type: String, // URL or base64
    required: true,
  },
  createdBy: {
    type: String, // Optional: use user ID or email if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
