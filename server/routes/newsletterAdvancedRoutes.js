const express = require('express');
const router = express.Router();

const {
  getSubscriberAnalytics,
  sendNewsletterCampaign,
  getAIGeneratedNewsletter
} = require('../controllers/newsletterAdvancedController');

// ✅ Analytics route
router.get('/analytics', getSubscriberAnalytics);

// ✅ Send email campaign
router.post('/campaign', sendNewsletterCampaign);

// ✅ Get AI-generated newsletter
router.get('/ai-suggestion', getAIGeneratedNewsletter);

module.exports = router;
