const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['appointment', 'health_reminder', 'prescription', 'followup', 'general'],
    required: true
  },
  subType: {
    type: String,
    enum: ['menstrual_cycle', 'blood_pressure', 'blood_sugar', 'medication', 'checkup']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'read'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  relatedAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  sentAt: {
    type: Date
  },
  readAt: {
    type: Date
  },
  deliveryMethod: {
    type: String,
    enum: ['email', 'sms', 'in-app'],
    default: 'in-app'
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
