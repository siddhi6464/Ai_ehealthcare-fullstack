const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.get('/health-reminders', notificationController.getHealthReminders);
router.patch('/health-reminders', notificationController.updateHealthReminders);
router.post('/health-reminders/trigger', notificationController.triggerRemindersNow);

module.exports = router;
