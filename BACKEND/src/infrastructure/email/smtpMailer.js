import nodemailer from 'nodemailer';
import config from '../../shared/config/index.js';
import logger from '../../shared/logger/index.js';
import {
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  getIndustryOnboardingEmailHtml
} from './emailTemplates.js';

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
    html: getVerificationEmailHtml({ name, code })
  };

  logger.info({ to: email }, 'Dispatching live SMTP verification email...');
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId, recipient: email }, '✅ Live SMTP Verification OTP Email sent successfully!');
    return info;
  } catch (err) {
    logger.warn({ recipient: email, error: err.message }, '⚠️ SMTP dispatch failed. OTP is preserved in database and console.');
    return { error: err.message, delivered: false };
  }
};

export const sendPasswordResetEmail = async ({ email, name, otp, code }) => {
  if (!email) throw new Error('Recipient email is required for password reset.');
  const resetCode = otp || code;

  const mailOptions = {
    from: `"JoharSetu Jharkhand Portal" <${emailUser}>`,
    to: email,
    subject: `🔑 ${resetCode} is your JoharSetu Password Reset Code`,
    html: getPasswordResetEmailHtml({ name, resetCode })
  };

  logger.info({ to: email }, 'Dispatching live SMTP password reset email...');
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId, recipient: email }, '✅ Live SMTP Password Reset Email sent successfully!');
    return info;
  } catch (err) {
    logger.warn({ recipient: email, error: err.message }, '⚠️ SMTP password reset dispatch failed.');
    return { error: err.message, delivered: false };
  }
};

export const sendIndustryOnboardingEmail = async ({
  email,
  emails,
  organizationName,
  spocName,
  industryId,
  loginEmail,
  temporaryPassword
}) => {
  const targetRecipients = emails && Array.isArray(emails) && emails.length > 0
    ? Array.from(new Set(emails.filter(Boolean))).join(', ')
    : email;

  if (!targetRecipients) {
    throw new Error('Recipient email is required for industry onboarding notification.');
  }

  const mailOptions = {
    from: `"Government of Jharkhand — JoharSetu" <${emailUser}>`,
    to: targetRecipients,
    subject: `🏛️ Official Approval & Portal Login Credentials — ${organizationName}`,
    html: getIndustryOnboardingEmailHtml({ spocName, organizationName, industryId, loginEmail, temporaryPassword })
  };

  logger.info({ to: targetRecipients, industryId }, 'Dispatching live SMTP industry onboarding email...');
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId, recipient: targetRecipients }, '✅ Live SMTP Industry Onboarding Email sent successfully!');
    return info;
  } catch (err) {
    logger.warn({ recipient: targetRecipients, error: err.message }, '⚠️ Industry onboarding email dispatch failed.');
    return { error: err.message, delivered: false };
  }
};

export default {
  transporter,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendIndustryOnboardingEmail
};
