import { sendVerificationEmail } from '../src/infrastructure/email/smtpMailer.js';
import dotenv from 'dotenv';
dotenv.config();

async function testOtp() {
  console.log("Testing OTP email...");
  try {
    const res = await sendVerificationEmail({ email: 'tauqueerwasi01@gmail.com', name: 'Tauqueer', code: '123456' });
    console.log("OTP Result:", res.messageId ? "SUCCESS" : "FAIL", res);
  } catch (err) {
    console.error("OTP Error:", err);
  }
}
testOtp();
