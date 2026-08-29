import logger from '../../../shared/logger/index.js';

export const seedUniversityDatabase = async () => {
  // All mock / seeded datasets removed. Operations run purely on real collections.
  logger.info('University seeding skipped: Real database mode active.');
  return true;
};

export default seedUniversityDatabase;
