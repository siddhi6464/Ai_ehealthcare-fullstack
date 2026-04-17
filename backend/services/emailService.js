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

module.exports = {
  sendEmailNotification,
  sendWelcomeEmail,
  sendAppointmentConfirmation
};
