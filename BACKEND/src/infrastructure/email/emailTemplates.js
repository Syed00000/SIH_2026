export const getVerificationEmailHtml = ({ name, code }) => `
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
        This OTP code is valid for <strong>15 minutes</strong>. Do not share this code with anyone.
      </p>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
      &copy; JoharSetu Jharkhand Portal. All rights reserved.
    </div>
  </div>
`;

export const getPasswordResetEmailHtml = ({ name, resetCode }) => `
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
        This code is valid for <strong>15 minutes</strong>. If you did not request this, please ignore this email.
      </p>
    </div>
  </div>
`;

export const getIndustryOnboardingEmailHtml = ({ spocName, organizationName, industryId, loginEmail, temporaryPassword }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px;">
    <h2 style="color: #0f172a; margin-top: 0;">Government of Jharkhand — JoharSetu</h2>
    <p style="color: #166534; font-weight: bold;">Application Approved & Onboarding Successful</p>
    <p>Dear ${spocName || 'Nodal Representative'},</p>
    <p>Partnership application for <strong>${organizationName}</strong> has been approved. Credentials:</p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Entity ID:</strong> ${industryId}</p>
      <p style="margin: 4px 0;"><strong>Login Email:</strong> ${loginEmail}</p>
      <p style="margin: 4px 0;"><strong>Temporary Password:</strong> <code style="color: #166534; font-size: 14px; font-weight: bold;">${temporaryPassword}</code></p>
    </div>
    <p><a href="http://localhost:5173/login" style="background: #0f172a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Log In to Portal</a></p>
  </div>
`;
