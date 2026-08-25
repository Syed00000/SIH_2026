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
    // 1. Initialize Databases with resilient fallback
    await connectMongo();

    // 2. Auto-seed Government Admin if configured
    await seedGovtAdmin();

    // 3. Initialize Background Workers
    initializeWorkers();

    // 3. Start HTTP Server
    server = http.createServer(app);
    
    server.listen(config.PORT, () => {
      logger.info(`🚀 Server running on port ${config.PORT}`);
    });

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
    logger.error('Bootstrap encountered warning, starting HTTP server...', error);
    server = http.createServer(app);
    server.listen(config.PORT, () => {
      logger.info(`🚀 Server running on port ${config.PORT} (standalone fallback)`);
    });
  }
};

start();
export default server;


