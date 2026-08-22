import mongoose from 'mongoose';
import config from '../../../shared/config/index.js';
import logger from '../../../shared/logger/index.js';

export const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db;
  }

  logger.info('Connecting to MongoDB via Mongoose...');
  try {
    await mongoose.connect(config.MONGO_URI, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    logger.info('Successfully connected to MongoDB via Mongoose');
    return mongoose.connection.db;
  } catch (error) {
    logger.error('Failed to connect to MongoDB via Mongoose', error);
    throw error;
  }
};

export const getDb = () => {
  if (mongoose.connection.readyState === 0) {
    throw new Error('Database not initialized. Call connectMongo() first.');
  }
  return mongoose.connection.db;
};

export const closeMongo = async () => {
  if (mongoose.connection.readyState !== 0) {
    logger.info('Closing Mongoose connection...');
    await mongoose.disconnect();
    logger.info('Mongoose connection closed');
  }
};
