const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

/**
 * Update medical history
 */
router.patch('/medical-history', async (req, res) => {
  try {
    const { medicalHistory, allergies, currentMedications } = req.body;

    const user = await User.findById(req.user._id);

    if (medicalHistory) user.medicalHistory = medicalHistory;
    if (allergies) user.allergies = allergies;
    if (currentMedications) user.currentMedications = currentMedications;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Medical history updated',
      data: { 
        medicalHistory: user.medicalHistory,
        allergies: user.allergies,
        currentMedications: user.currentMedications
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Get medical history
 */
router.get('/medical-history', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        medicalHistory: user.medicalHistory,
        allergies: user.allergies,
        currentMedications: user.currentMedications
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
