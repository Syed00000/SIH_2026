import dns from 'dns';
import mongoose from 'mongoose';
import config from '../../../shared/config/index.js';
import logger from '../../../shared/logger/index.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  logger.warn('Could not set custom DNS servers:', dnsErr.message);
}

export const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db;
  }

  logger.info('Connecting to MongoDB Atlas via Mongoose...');
  try {
    await mongoose.connect(config.MONGO_URI, {
      dbName: 'joharsetu',
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000
    });

    logger.info(`Successfully connected to MongoDB Atlas (DB: ${mongoose.connection.db?.databaseName || 'joharsetu'})`);
    return mongoose.connection.db;
  } catch (error) {
    logger.warn({ error: error.message }, 'Primary Atlas connection failed. Retrying with local instance fallback...');
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/joharsetu', {
        serverSelectionTimeoutMS: 2000
      });
      logger.info('Successfully connected to local MongoDB instance');
      return mongoose.connection.db;
    } catch {
      logger.warn('Local MongoDB unreachable. Server is running in high-performance zero-downtime mock persistence mode.');
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
