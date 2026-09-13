import { sendVerificationEmail } from '../src/infrastructure/email/smtpMailer.js';

async function test() {
  try {
    const res = await sendVerificationEmail({ email: 'test@example.com', name: 'Test', code: '123456' });
    console.log("Email Result:", res);
  } catch (err) {
    console.error("Email Error:", err);
  }
}

test();
