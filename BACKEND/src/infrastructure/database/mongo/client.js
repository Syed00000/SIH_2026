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
    logger.warn('Primary MongoDB Atlas connection timed out. Attempting local MongoDB connection...');
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/joharsetu', {
        serverSelectionTimeoutMS: 3000
      });
      logger.info('Successfully connected to local MongoDB instance');
      return mongoose.connection.db;
    } catch (localError) {
      logger.warn('Local MongoDB unreachable. Server will continue in mock-persistence mode for zero-downtime execution.');
      return null;
    }
  }
};

export const getDb = () => {
  return mongoose.connection.db || null;
};

export const closeMongo = async () => {
  if (mongoose.connection.readyState !== 0) {
    logger.info('Closing Mongoose connection...');
    await mongoose.disconnect();
    logger.info('Mongoose connection closed');
  }
};
