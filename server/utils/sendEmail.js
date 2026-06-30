// Import required modules
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Reusable email utility function to send emails via Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 * @returns {Promise} Returns promise of email sending
 */
const sendEmail = async (options) => {
  try {
    // 1. Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // SMTP username from .env
        pass: process.env.SMTP_PASS, // SMTP password/app password from .env
      },
    });

    // 2. Define email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM || 'DailyFixCare'} <${process.env.SMTP_USER}>`, // Sender address
      to: options.to, // List of recipients
      subject: options.subject, // Subject line
      html: options.html, // HTML body
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Log but don't throw so order still completes even if email fails
    throw error; // Can be caught in calling function
  }
};

export default sendEmail;