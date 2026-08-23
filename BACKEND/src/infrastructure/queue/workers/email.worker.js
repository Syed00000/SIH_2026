import queue from '../queue.js';
import logger from '../../../shared/logger/index.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../email/smtpMailer.js';

export const initializeWorkers = () => {
  queue.registerWorker('sendEmailVerification', async (data) => {
    const { userId, email, name, code } = data;
    logger.info({ userId, email, name, code }, 'Worker starting live SMTP sendEmailVerification...');
    try {
      await sendVerificationEmail({ email, name, code });
      logger.info({ email }, 'Verification email successfully sent via Nodemailer SMTP');
    } catch (error) {
      logger.error({ email, error: error.message }, 'Failed to send verification email via Nodemailer SMTP');
    }
  });

  queue.registerWorker('sendPasswordReset', async (data) => {
    const { email, name, otp, code } = data;
    logger.info({ email, name, code: otp || code }, 'Worker starting live SMTP sendPasswordReset...');
    try {
      await sendPasswordResetEmail({ email, name, otp, code });
      logger.info({ email }, 'Password reset email successfully sent via Nodemailer SMTP');
    } catch (error) {
      logger.error({ email, error: error.message }, 'Failed to send password reset email via Nodemailer SMTP');
    }
  });
};

export default initializeWorkers;
