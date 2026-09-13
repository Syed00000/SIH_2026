import { sendVerificationEmail } from '../src/infrastructure/email/smtpMailer.js';

async function testFallback() {
  console.log("Testing email sending with fallback...");
  try {
    const res = await sendVerificationEmail({ email: 'test@example.com', name: 'Tauqueer', code: '123456' });
    console.log("Fallback Result:", res);
  } catch (err) {
    console.error("Fallback Error:", err);
  }
}
testFallback();
