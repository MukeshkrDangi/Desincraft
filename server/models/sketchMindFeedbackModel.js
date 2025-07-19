const mongoose = require('mongoose');

const sketchMindSchema = new mongoose.Schema(
  {
    feedback: { type: String, required: true },
    voiceNoteUrl: String,
    sketchImageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SketchMindFeedback', sketchMindSchema);
