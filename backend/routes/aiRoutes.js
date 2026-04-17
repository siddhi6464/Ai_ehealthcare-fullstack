const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All AI routes require authentication
router.use(protect);

router.post('/analyze', aiController.analyzeSymptoms);
router.post('/recommendations', aiController.getHealthRecommendations);
router.get('/symptoms', aiController.getAllSymptoms);
router.get('/symptoms/:symptom/related', aiController.getRelatedSymptoms);

module.exports = router;
