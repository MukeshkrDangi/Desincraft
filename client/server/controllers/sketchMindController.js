import SketchMindFeedback from '../models/sketchMindFeedbackModel.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Stub AI summary function
const summarizeFeedback = (drawingFile, audioFile) => {
  return "🧠 Suggested changes: Make logo bigger and align text center.";
};

export const uploadSketchFeedback = async (req, res) => {
  try {
    const imageFile = req.files.image?.[0];
    const voiceFile = req.files.voiceNote?.[0];

    const uploadsDir = path.join('server', 'uploads', 'feedback');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const imagePath = imageFile
      ? `/uploads/feedback/${uuidv4()}_${imageFile.originalname}`
      : null;
    const voicePath = voiceFile
      ? `/uploads/feedback/${uuidv4()}_${voiceFile.originalname}`
      : null;

    if (imageFile) {
      fs.writeFileSync(path.join('server', imagePath), imageFile.buffer);
    }

    if (voiceFile) {
      fs.writeFileSync(path.join('server', voicePath), voiceFile.buffer);
    }

    const feedback = new SketchMindFeedback({
      projectId: req.body.projectId || null,
      imageUrl: imagePath,
      voiceUrl: voicePath,
      aiSummary: summarizeFeedback(imageFile, voiceFile),
    });

    await feedback.save();

    res.status(200).json({ message: '✅ Feedback saved', feedback });
  } catch (err) {
    console.error('❌ Error uploading feedback:', err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
};

export const getAllSketchFeedbacks = async (req, res) => {
  try {
    const feedbacks = await SketchMindFeedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error('❌ Failed to fetch feedbacks', err);
    res.status(500).json({ error: 'Server Error' });
  }
};
