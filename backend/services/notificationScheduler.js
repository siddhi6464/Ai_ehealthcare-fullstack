/**
 * NOTIFICATION SCHEDULER
 * Automated system for sending health reminders using node-cron
 */

const cron = require('node-cron');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmailNotification } = require('./emailService');

/**
 * Calculate next menstrual cycle date
 */
function calculateNextCycleDate(lastDate, cycleLength) {
  const next = new Date(lastDate);
  next.setDate(next.getDate() + cycleLength);
  return next;
}

/**
 * Check and send menstrual cycle reminders
 */
async function checkMenstrualReminders() {
  try {
    const users = await User.find({
      'healthReminders.menstrualCycle.enabled': true,
      'healthReminders.menstrualCycle.lastDate': { $exists: true }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const user of users) {
      const { lastDate, cycleLength } = user.healthReminders.menstrualCycle;
      const nextDate = calculateNextCycleDate(lastDate, cycleLength);
      
      // Send reminder 2 days before expected date
      const reminderDate = new Date(nextDate);
      reminderDate.setDate(reminderDate.getDate() - 2);

      if (today.getTime() === reminderDate.getTime()) {
        await createNotification({
          user: user._id,
          type: 'health_reminder',
          subType: 'menstrual_cycle',
          title: '🩸 Menstrual Cycle Reminder',
          message: `Your period is expected in 2 days (around ${nextDate.toDateString()}). Track your cycle and stay prepared.`,
          scheduledFor: new Date(),
          priority: 'medium'
        });

        console.log(`✅ Menstrual reminder sent to ${user.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error in menstrual reminders:', error);
  }
}

/**
 * Check and send blood pressure reminders
 */
async function checkBloodPressureReminders() {
  try {
    const users = await User.find({
      'healthReminders.bloodPressure.enabled': true
    });

    const today = new Date();

    for (const user of users) {
      const { frequency, lastChecked } = user.healthReminders.bloodPressure;
      
      let shouldRemind = false;
      if (lastChecked) {
        const daysSinceCheck = Math.floor((today - new Date(lastChecked)) / (1000 * 60 * 60 * 24));
        const freqDays = parseInt(frequency) || 7; // Default to 7 if parsing fails
        
        if (daysSinceCheck >= freqDays) {
          shouldRemind = true;
        }
      } else {
        shouldRemind = true; // First time reminder
      }

      if (shouldRemind) {
        await createNotification({
          user: user._id,
          type: 'health_reminder',
          subType: 'blood_pressure',
          title: '💓 Blood Pressure Check Reminder',
          message: `It's time for your ${frequency} blood pressure check. Regular monitoring helps maintain heart health.`,
          scheduledFor: new Date(),
          priority: 'high'
        });

        console.log(`✅ BP reminder sent to ${user.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error in BP reminders:', error);
  }
}

/**
 * Check and send blood sugar reminders
 */
async function checkBloodSugarReminders() {
  try {
    const users = await User.find({
      'healthReminders.bloodSugar.enabled': true
    });

    const today = new Date();

    for (const user of users) {
      const { frequency, lastChecked } = user.healthReminders.bloodSugar;
      
      let shouldRemind = false;
      if (lastChecked) {
        const daysSinceCheck = Math.floor((today - new Date(lastChecked)) / (1000 * 60 * 60 * 24));
        const freqDays = parseInt(frequency) || 7; // Default to 7 if parsing fails
        
        if (daysSinceCheck >= freqDays) {
          shouldRemind = true;
        }
      } else {
        shouldRemind = true; // First time reminder
      }

      if (shouldRemind) {
        await createNotification({
          user: user._id,
          type: 'health_reminder',
          subType: 'blood_sugar',
          title: '🩺 Blood Sugar Check Reminder',
          message: `Time for your ${frequency} blood sugar check. Keep your diabetes in check with regular monitoring.`,
          scheduledFor: new Date(),
          priority: 'high'
        });

        console.log(`✅ Blood sugar reminder sent to ${user.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error in blood sugar reminders:', error);
  }
}

/**
 * Check and send appointment reminders
 */
async function checkAppointmentReminders() {
  try {
    const Appointment = require('../models/Appointment');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: tomorrow, $lt: dayAfter },
      status: 'scheduled',
      reminderSent: false
    }).populate('patient doctor');

    for (const appointment of appointments) {
      await createNotification({
        user: appointment.patient._id,
        type: 'appointment',
        title: '📅 Appointment Reminder',
        message: `You have an appointment with Dr. ${appointment.doctor.name} tomorrow at ${appointment.timeSlot.startTime}. Please be on time.`,
        scheduledFor: new Date(),
        priority: 'high',
        relatedAppointment: appointment._id
      });

      appointment.reminderSent = true;
      await appointment.save();

      console.log(`✅ Appointment reminder sent for ${appointment.patient.email}`);
    }
  } catch (error) {
    console.error('❌ Error in appointment reminders:', error);
  }
}

/**
 * Create notification and optionally send email
 */
async function createNotification(notificationData) {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    // Send email if user has email
    const user = await User.findById(notificationData.user);
    if (user && user.email) {
      await sendEmailNotification(
        user.email,
        notificationData.title,
        notificationData.message
      );
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Start all scheduled jobs
 */
function startNotificationScheduler() {
  console.log('🔔 Starting notification scheduler...');

  // Run every day at 9:00 AM for health reminders
  cron.schedule('0 9 * * *', () => {
    console.log('⏰ Running daily health reminders...');
    checkMenstrualReminders();
    checkBloodPressureReminders();
    checkBloodSugarReminders();
  });

  // Run every day at 6:00 PM for appointment reminders
  cron.schedule('0 18 * * *', () => {
    console.log('⏰ Running appointment reminders...');
    checkAppointmentReminders();
  });

  // For testing: Run every minute (comment out in production)
  // cron.schedule('* * * * *', () => {
  //   console.log('⏰ Running test reminders...');
  //   checkBloodPressureReminders();
  // });

  console.log('✅ Notification scheduler started successfully');
  console.log('📅 Health reminders: Daily at 9:00 AM');
  console.log('📅 Appointment reminders: Daily at 6:00 PM');
}

module.exports = {
  startNotificationScheduler,
  createNotification,
  checkMenstrualReminders,
  checkBloodPressureReminders,
  checkBloodSugarReminders,
  checkAppointmentReminders
};
