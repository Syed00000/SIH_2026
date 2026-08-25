import dotenv from 'dotenv';
import { connectMongo, closeMongo } from '../infrastructure/database/mongo/client.js';
import { seedGovtAdmin } from '../infrastructure/database/mongo/seed.js';
import logger from '../shared/logger/index.js';

dotenv.config();

const runSeed = async () => {
  logger.info('Starting manual database seeding script...');
  try {
    await connectMongo();
    await seedGovtAdmin();
    logger.info('Database seeding completed successfully.');
  } catch (err) {
    logger.error('Database seeding failed', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

runSeed();
