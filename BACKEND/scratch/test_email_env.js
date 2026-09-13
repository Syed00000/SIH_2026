import dotenv from 'dotenv';
dotenv.config();

import { sendVerificationEmail } from '../src/infrastructure/email/smtpMailer.js';

async function test() {
  console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
  try {
    const res = await sendVerificationEmail({ email: 'test@example.com', name: 'Test', code: '123456' });
    console.log("Email Result:", res);
  } catch (err) {
    console.error("Email Error:", err);
  }
}

test();
