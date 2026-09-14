import { sendVerificationEmail, sendPasswordResetEmail } from '../src/infrastructure/email/smtpMailer.js';
import dotenv from 'dotenv';
dotenv.config();

async function testAll() {
  console.log("Testing email verification...");
  try {
    const res = await sendVerificationEmail({ email: 'tauqueerwasi01@gmail.com', name: 'Tauqueer', code: '123456' });
    console.log("Email Verification Result:", res.messageId ? "SUCCESS" : "FAIL", res);
  } catch (err) {
    console.error("Email Verification Error:", err);
  }
}
testAll();
