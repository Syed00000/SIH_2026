import { sendVerificationEmail, sendPasswordResetEmail } from '../src/infrastructure/email/smtpMailer.js';
import dotenv from 'dotenv';
dotenv.config();

async function testAll() {
  console.log("Testing password reset...");
  try {
    const res2 = await sendPasswordResetEmail({ email: 'tauqueerwasi01@gmail.com', name: 'Tauqueer', otp: '777888' });
    console.log("Password Reset Result:", res2.messageId ? "SUCCESS" : "FAIL", res2);
  } catch (err) {
    console.error("Password Reset Error:", err);
  }
}
testAll();
