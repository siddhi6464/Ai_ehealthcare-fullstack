/**
 * EMAIL SERVICE
 * Handles sending email notifications to users
 */

const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email notification
 */
async function sendEmailNotification(to, subject, text, html = null) {
  try {
    // If no HTML provided, create basic HTML from text
    const htmlContent = html || `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #2c3e50;">eHealthCare Notification</h2>
        <p style="font-size: 16px; line-height: 1.6;">${text}</p>
        <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
        <p style="font-size: 12px; color: #7f8c8d;">
          This is an automated message from eHealthCare System. Please do not reply to this email.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"eHealthCare System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email
 */
async function sendWelcomeEmail(to, name) {
  const subject = 'Welcome to eHealthCare!';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h1 style="color: #3498db;">Welcome to eHealthCare! 👋</h1>
      <p style="font-size: 16px;">Hi ${name},</p>
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you for registering with eHealthCare. We're excited to have you on board!
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        With eHealthCare, you can:
      </p>
      <ul style="font-size: 16px; line-height: 1.8;">
        <li>Book appointments with qualified doctors</li>
        <li>Get AI-powered health recommendations</li>
        <li>Receive timely health reminders</li>
        <li>Track your medical history</li>
      </ul>
      <p style="font-size: 16px;">
        Start your health journey today!
      </p>
      <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
      <p style="font-size: 12px; color: #7f8c8d;">
        This is an automated message from eHealthCare System.
      </p>
    </div>
  `;
  return await sendEmailNotification(to, subject, `Welcome ${name}!`, html);
}

/**
 * Send appointment confirmation email
 */
async function sendAppointmentConfirmation(to, appointmentDetails) {
  const subject = 'Appointment Confirmed - eHealthCare';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #27ae60;">✅ Appointment Confirmed</h2>
      <p style="font-size: 16px;">Your appointment has been successfully booked!</p>
      
      <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${appointmentDetails.doctorName}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDetails.date}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentDetails.time}</p>
        <p style="margin: 5px 0;"><strong>Reason:</strong> ${appointmentDetails.reason}</p>
      </div>
      
      <p style="font-size: 14px; color: #e74c3c;">
        ⚠️ Please arrive 10 minutes before your scheduled time.
      </p>
      
      <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
      <p style="font-size: 12px; color: #7f8c8d;">
        This is an automated message from eHealthCare System.
      </p>
    </div>
  `;
  return await sendEmailNotification(to, subject, 'Appointment Confirmed', html);
}

/**
 * Send appointment confirmation email to doctor
 */
async function sendDoctorAppointmentConfirmation(to, appointmentDetails) {
  const subject = 'New Appointment Booked - eHealthCare';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #3498db;">📅 New Appointment</h2>
      <p style="font-size: 16px;">A new appointment has been booked with you.</p>
      
      <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Patient:</strong> ${appointmentDetails.patientName}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDetails.date}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentDetails.time}</p>
        <p style="margin: 5px 0;"><strong>Reason:</strong> ${appointmentDetails.reason}</p>
      </div>
      
      <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
      <p style="font-size: 12px; color: #7f8c8d;">
        This is an automated message from eHealthCare System.
      </p>
    </div>
  `;
  return await sendEmailNotification(to, subject, 'New Appointment Booked', html);
}

/**
 * Send doctor login alert
 */
async function sendDoctorLoginAlert(to, name) {
  const subject = 'New Login Detected - eHealthCare';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #f39c12;">🔔 Security Alert: New Login</h2>
      <p style="font-size: 16px;">Hello Dr. ${name},</p>
      <p style="font-size: 16px; line-height: 1.6;">
        We detected a new login to your eHealthCare doctor account just now.
      </p>
      <p style="font-size: 14px; color: #7f8c8d;">
        If this was you, no further action is required. If you did not log in, please reset your password immediately.
      </p>
      <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
      <p style="font-size: 12px; color: #7f8c8d;">
        This is an automated security message from eHealthCare System.
      </p>
    </div>
  `;
  return await sendEmailNotification(to, subject, 'New Login Detected', html);
}

/**
 * Send appointment cancellation email
 */
async function sendAppointmentCancellation(to, appointmentDetails, isDoctor = false) {
  const subject = 'Appointment Cancelled - eHealthCare';
  const greeting = isDoctor ? `Dr. ${appointmentDetails.doctorName}` : appointmentDetails.patientName;
  const personContext = isDoctor ? `with patient ${appointmentDetails.patientName}` : `with Dr. ${appointmentDetails.doctorName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #e74c3c;">❌ Appointment Cancelled</h2>
      <p style="font-size: 16px;">Hello ${greeting},</p>
      <p style="font-size: 16px;">Your appointment ${personContext} has been cancelled.</p>
      
      <div style="background: #fdf2f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDetails.date}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentDetails.time}</p>
      </div>
      
      <p style="font-size: 14px; color: #7f8c8d;">
        If you need to reschedule, please visit the eHealthCare portal.
      </p>
      
      <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
      <p style="font-size: 12px; color: #7f8c8d;">
        This is an automated message from eHealthCare System.
      </p>
    </div>
  `;
  return await sendEmailNotification(to, subject, 'Appointment Cancelled', html);
}

module.exports = {
  sendEmailNotification,
  sendWelcomeEmail,
  sendAppointmentConfirmation,
  sendDoctorAppointmentConfirmation,
  sendDoctorLoginAlert,
  sendAppointmentCancellation
};
