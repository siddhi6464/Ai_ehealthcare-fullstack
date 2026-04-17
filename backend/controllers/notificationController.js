const Notification = require('../models/Notification');
const User = require('../models/User');
const { checkMenstrualReminders, checkBloodPressureReminders, checkBloodSugarReminders } = require('../services/notificationScheduler');

/**
 * Get user notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const { status, type } = req.query;
    
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .sort({ scheduledFor: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: { notifications }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status: 'read', readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update health reminder preferences
 */
exports.updateHealthReminders = async (req, res) => {
  try {
    const { menstrualCycle, bloodPressure, bloodSugar } = req.body;

    const user = await User.findById(req.user._id);

    if (menstrualCycle) {
      user.healthReminders.menstrualCycle = {
        ...user.healthReminders.menstrualCycle,
        ...menstrualCycle
      };
    }

    if (bloodPressure) {
      user.healthReminders.bloodPressure = {
        ...user.healthReminders.bloodPressure,
        ...bloodPressure
      };
    }

    if (bloodSugar) {
      user.healthReminders.bloodSugar = {
        ...user.healthReminders.bloodSugar,
        ...bloodSugar
      };
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Health reminders updated',
      data: { healthReminders: user.healthReminders }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get health reminder settings
 */
exports.getHealthReminders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: { healthReminders: user.healthReminders }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Manually trigger the scheduled cron routines immediately for testing
 */
exports.triggerRemindersNow = async (req, res) => {
  try {
    // Dispatch automated checks instantly
    checkMenstrualReminders();
    checkBloodPressureReminders();
    checkBloodSugarReminders();

    res.status(200).json({
      status: 'success',
      message: 'System checks deployed successfully.'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
