import http from 'http';
import app from './app.js';
import config from './shared/config/index.js';
import logger from './shared/logger/index.js';
import { connectMongo, closeMongo } from './infrastructure/database/mongo/client.js';
import { initializeWorkers } from './infrastructure/queue/workers/email.worker.js';
import { seedGovtAdmin } from './infrastructure/database/mongo/seed.js';

let server;

const start = async () => {
  logger.info(`Starting server in ${config.NODE_ENV} mode...`);

  try {
    // 1. Start HTTP Server immediately so port is instantly open (zero connection-refused cold starts)
    server = http.createServer(app);

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${config.PORT} is already in use by another process. Please terminate the existing process or use another port.`);
        process.exit(1);
      } else {
        logger.error('HTTP server encountered an error:', err);
      }
    });

    await new Promise((resolve) => {
      server.listen(config.PORT, () => {
        logger.info(`🚀 Server running and listening on port ${config.PORT}`);
        resolve();
      });
    });

    // 2. Initialize Database & Background Services (Mongoose buffers queries seamlessly while connecting)
    connectMongo()
      .then(async () => {
        // Auto-seed Government Admin once DB is connected
        await seedGovtAdmin();
      })
      .catch((err) => {
        logger.error('Failed to initialize MongoDB connection:', err);
      });

    // 3. Initialize Background Workers
    initializeWorkers();

    // Handle process events for Graceful Shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      const forceShutdownTimeout = setTimeout(() => {
        logger.error('Shutdown timed out. Forcing exit...');
        process.exit(1);
      }, 10000);

      if (server) {
        logger.info('Stopping HTTP server from accepting new traffic...');
        await new Promise((resolve) => {
          server.close(() => {
            logger.info('HTTP server stopped.');
            resolve();
          });
        });
      }

      try {
        await closeMongo();
        clearTimeout(forceShutdownTimeout);
        logger.info('Graceful shutdown completed successfully.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown connections cleanup', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Error during server bootstrap:', error);
  }
};

start();
export default server;


