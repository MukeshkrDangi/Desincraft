const Feedback = require('../models/feedbackModel');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// 🎧 Helper: Get audio duration
const getAudioDuration = (filePath) =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });

/* ============================================================
    🔵 1. Order-Specific Feedback Submission (voice only)
============================================================ */
exports.submitFeedback = async (req, res) => {
  try {
    const { orderId, feedback } = req.body;
    let voiceNoteUrl = null;

    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', 'feedback', req.file.filename);
      const duration = await getAudioDuration(filePath);
      if (duration > 180) {
        return res.status(400).json({ message: '❌ Voice note exceeds 3 minutes.' });
      }
      voiceNoteUrl = `/uploads/feedback/${req.file.filename}`;
    }

    const newFeedback = new Feedback({
      orderId,
      feedback,
      voiceNoteUrl,
      type: 'order',
    });

    await newFeedback.save();
    res.status(201).json({ message: '✅ Feedback submitted' });
  } catch (error) {
    console.error('❌ Error submitting order feedback:', error);
    res.status(500).json({ message: '❌ Server error' });
  }
};

/* ============================================================
    🎨 2. SketchMind Feedback Submission (canvas image + voice)
============================================================ */
exports.submitSketchMindFeedback = async (req, res) => {
  try {
    console.log('📥 BODY:', req.body);
    console.log('📁 FILES:', req.files);

    const { feedback } = req.body;


    let voiceNoteUrl = null;
    let sketchImageUrl = null;

    if (req.files?.voiceNote) {
      const voiceFile = req.files.voiceNote[0];
      const filePath = voiceFile.path;
      const duration = await getAudioDuration(filePath);
      if (duration > 180) {
        return res.status(400).json({ message: '❌ Voice note exceeds 3 minutes.' });
      }
      voiceNoteUrl = `/uploads/feedback/${voiceFile.filename}`;
    }

    if (req.files?.image) {
      sketchImageUrl = `/uploads/feedback/${req.files.image[0].filename}`;
    }


    const newFeedback = new Feedback({
      feedback,
      voiceNoteUrl,
      sketchImageUrl,
      type: 'sketchmind',
    });

    await newFeedback.save();
    console.log('✅ SketchMind feedback saved:', newFeedback);

    res.status(201).json({ message: '✅ Feedback submitted' });
  } catch (error) {
    console.error('❌ SketchMind Error:', error);
    res.status(500).json({ message: '❌ SketchMind submission failed' });
  }
};



/* ============================================================
    🟢 3. Admin: Fetch Only SketchMind Feedbacks
============================================================ */
exports.getSketchMindFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ type: 'sketchmind' }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('❌ Error fetching SketchMind feedbacks:', error);
    res.status(500).json({ message: '❌ Failed to fetch SketchMind feedbacks' });
  }
};

/* ============================================================
    🛡️ 4. Admin: Fetch All Feedbacks
============================================================ */
exports.getAllFeedbacks = async (req, res) => {
  try {
    const all = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (error) {
    console.error('❌ Error fetching all feedbacks:', error);
    res.status(500).json({ message: '❌ Failed to fetch feedbacks' });
  }
};

/* ============================================================
    🧹 5. Admin: Delete Feedback by ID
============================================================ */
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: '✅ Feedback deleted' });
  } catch (error) {
    console.error('❌ Error deleting feedback:', error);
    res.status(500).json({ message: '❌ Failed to delete feedback' });
  }
};
