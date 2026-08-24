import dns from 'dns';
import mongoose from 'mongoose';
import config from '../../../shared/config/index.js';
import logger from '../../../shared/logger/index.js';

export const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db;
  }

  logger.info('Connecting to MongoDB Atlas via Mongoose...');
  try {
    // 1. Try to connect using system DNS resolver
    await mongoose.connect(config.MONGO_URI, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000
    });

    logger.info(`Successfully connected to MongoDB Atlas (DB: ${mongoose.connection.db.databaseName})`);
    return mongoose.connection.db;
  } catch (error) {
    logger.warn({ error: error.message }, 'Primary MongoDB Atlas connection failed. Attempting custom DNS resolution override...');
    
    // 2. Try with custom DNS override (Google/Cloudflare)
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
      await mongoose.connect(config.MONGO_URI, {
        maxPoolSize: 50,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000
      });
      logger.info(`Successfully connected to MongoDB Atlas via custom DNS override (DB: ${mongoose.connection.db.databaseName})`);
      return mongoose.connection.db;
    } catch (dnsOverrideError) {
      logger.warn({ error: dnsOverrideError.message }, 'MongoDB Atlas connection failed with custom DNS override. Attempting local MongoDB connection...');
      
      // 3. Try local MongoDB connection
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
