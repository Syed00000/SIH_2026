import nodemailer from 'nodemailer';
import config from '../../shared/config/index.js';
import logger from '../../shared/logger/index.js';

const emailUser = process.env.EMAIL_USER || 'officialsamadhan043@gmail.com';
const emailPass = process.env.EMAIL_PASS || 'golq ocsq tcqk pcxg';
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: emailUser,
    pass: emailPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationEmail = async ({ email, name, code }) => {
  if (!email) throw new Error('Recipient email is required for sending verification OTP.');

  const mailOptions = {
    from: `"JoharSetu Jharkhand Portal" <${emailUser}>`,
    to: email,
    subject: `🔐 ${code} is your JoharSetu Email Verification OTP Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">JoharSetu Portal</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Jharkhand Societal Innovation & University Matching Platform</p>
        </div>
        
        <div style="padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #cbd5e1; text-align: center;">
          <h3 style="color: #0f172a; font-size: 16px; margin-top: 0;">Hello ${name || 'User'},</h3>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            Thank you for registering on <strong>JoharSetu</strong>. Use the 6-digit verification code below to verify your email address and activate your account:
          </p>
          
          <div style="margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; background-color: #eff6ff; padding: 12px 24px; border-radius: 10px; border: 2px dashed #3b82f6; display: inline-block;">
              ${code}
            </span>
          </div>

          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
            This OTP code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>

        <div style="margin-top: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
          &copy; JoharSetu Jharkhand Portal. All rights reserved.
        </div>
      </div>
    `
  };

  logger.info({ to: email }, 'Dispatching live SMTP verification email...');
  const info = await transporter.sendMail(mailOptions);
  logger.info({ messageId: info.messageId, recipient: email }, '✅ Live SMTP Verification OTP Email sent successfully!');
  return info;
};

export const sendPasswordResetEmail = async ({ email, name, otp, code }) => {
  if (!email) throw new Error('Recipient email is required for password reset.');
  const resetCode = otp || code;

  const mailOptions = {
    from: `"JoharSetu Jharkhand Portal" <${emailUser}>`,
    to: email,
    subject: `🔑 ${resetCode} is your JoharSetu Password Reset Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin: 0;">JoharSetu Portal</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Password Reset Request</p>
        </div>
        
        <div style="padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #cbd5e1; text-align: center;">
          <h3 style="color: #0f172a; font-size: 16px; margin-top: 0;">Hello ${name || 'User'},</h3>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            We received a request to reset your password. Use the 6-digit code below to set a new password:
          </p>
          
          <div style="margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7c3aed; background-color: #f3e8ff; padding: 12px 24px; border-radius: 10px; border: 2px dashed #8b5cf6; display: inline-block;">
              ${resetCode}
            </span>
          </div>

          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
            This OTP code is valid for <strong>15 minutes</strong>. If you did not request this, please ignore this email.
          </p>
        </div>
      </div>
    `
  };

  logger.info({ to: email }, 'Dispatching live SMTP password reset email...');
  const info = await transporter.sendMail(mailOptions);
  logger.info({ messageId: info.messageId, recipient: email }, '✅ Live SMTP Password Reset Email sent successfully!');
  return info;
};

export default {
  transporter,
  sendVerificationEmail,
  sendPasswordResetEmail
};
