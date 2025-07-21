const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    orderId: { type: String }, // optional
    feedback: { type: String },
    voiceNoteUrl: { type: String },
    sketchImageUrl: { type: String },
    type: {
      type: String,
      enum: ['order', 'sketchmind'],
      default: 'order',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
