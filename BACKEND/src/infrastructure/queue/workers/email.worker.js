import queue from '../queue.js';
import logger from '../../../shared/logger/index.js';

export const initializeWorkers = () => {
  queue.registerWorker('sendEmailVerification', async (data) => {
    const { userId, email, name } = data;
    logger.info({ userId, email, name }, 'Sending verification email in background...');
    await new Promise((resolve) => setTimeout(resolve, 300));
    logger.info({ email }, 'Verification email successfully sent');
  });

  queue.registerWorker('sendPasswordReset', async (data) => {
    const { email, name, resetToken } = data;
    logger.info({ email, name }, 'Sending password reset link in background...');
    await new Promise((resolve) => setTimeout(resolve, 300));
    logger.info({ email }, 'Password reset email successfully sent');
  });
};

export default initializeWorkers;
