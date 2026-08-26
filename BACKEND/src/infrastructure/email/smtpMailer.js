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
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #0f172a;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Official Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #16a34a;">
              <table align="center" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <img src="https://www.jharkhand.gov.in/images/jhlogo55.PNG" alt="Government of Jharkhand" width="60" height="60" style="display: block; margin: 0 auto 10px auto; border: 0;" />
                    <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.5px;">GOVERNMENT OF JHARKHAND</h2>
                    <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Department of Higher & Technical Education &bull; JoharSetu Portal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 700;">
                  ✔ Application Approved & Onboarding Successful
                </p>
              </div>

              <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px 0;">Dear ${spocName || 'Nodal Representative'},</h3>
              
              <p style="color: #334155; font-size: 13.5px; line-height: 1.6; margin: 0 0 16px 0;">
                We are pleased to inform you that the partnership application for <strong>${organizationName}</strong> has been officially <strong>Reviewed and Approved</strong> by the Government of Jharkhand.
              </p>

              <p style="color: #334155; font-size: 13.5px; line-height: 1.6; margin: 0 0 20px 0;">
                Your dedicated industry portal account has been activated. Please find your official login credentials below:
              </p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="6" cellspacing="0">
                      <tr>
                        <td width="35%" style="font-size: 12px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Organization Name:</td>
                        <td style="font-size: 13px; color: #0f172a; font-weight: 700; border-bottom: 1px solid #e2e8f0;">${organizationName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Entity Reference ID:</td>
                        <td style="font-size: 13px; color: #0f172a; font-family: monospace; font-weight: 700; border-bottom: 1px solid #e2e8f0;">${industryId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Portal Login Email:</td>
                        <td style="font-size: 13px; color: #0f172a; font-family: monospace; font-weight: 700; border-bottom: 1px solid #e2e8f0;">${loginEmail}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #64748b; font-weight: 600;">Temporary Password:</td>
                        <td style="font-size: 14px; color: #166534; font-family: monospace; font-weight: 800; background-color: #ecfdf5; padding: 6px 10px; border-radius: 4px; display: inline-block;">${temporaryPassword}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Login Button CTA -->
              <div style="text-align: center; margin: 24px 0;">
                <a href="http://localhost:5173/login" style="background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 6px; display: inline-block;">
                  Log In to JoharSetu Portal &rarr;
                </a>
              </div>

              <!-- Security Guidelines -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 12px 16px; margin-top: 20px;">
                <p style="margin: 0; color: #92400e; font-size: 12px; line-height: 1.5;">
                  <strong>Important Security Instructions:</strong><br />
                  &bull; Log in using your registered credentials.<br />
                  &bull; For security reasons, please change your temporary password upon first login.<br />
                  &bull; Do not share these credentials with unauthorized individuals.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">JoharSetu &bull; Innovation & Industry Collaboration Cell</p>
              <p style="margin: 0;">Department of Higher & Technical Education, Government of Jharkhand, Ranchi &bull; 834001</p>
              <p style="margin: 6px 0 0 0; color: #94a3b8;">This is an automated administrative notification. Please do not reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </body>
      </html>
    `
  };

  logger.info({ to: targetRecipients, industryId }, 'Dispatching live SMTP industry onboarding email...');
  const info = await transporter.sendMail(mailOptions);
  logger.info({ messageId: info.messageId, recipient: targetRecipients }, '✅ Live SMTP Industry Onboarding Email sent successfully!');
  return info;
};

export default {
  transporter,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendIndustryOnboardingEmail
};
