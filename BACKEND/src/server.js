import http from 'http';
import app from './app.js';
import config from './shared/config/index.js';
import logger from './shared/logger/index.js';
import { connectMongo, closeMongo } from './infrastructure/database/mongo/client.js';
import { initializeWorkers } from './infrastructure/queue/workers/email.worker.js';
import { initializeSocketServer, closeSocketServer } from './infrastructure/socket/socketServer.js';

let server;

// Prevent unhandled promise rejections or exceptions from crashing the server loop
// Resilient process listeners initialized
process.on('unhandledRejection', (reason) => {
  logger.error({ reason: reason instanceof Error ? reason.message : reason, stack: reason?.stack }, '🚨 Unhandled Promise Rejection');
});

process.on('uncaughtException', (error) => {
  logger.error({ error: error.message, stack: error.stack }, '🚨 Uncaught Exception');
});

const listenWithRetry = (httpServer, port, host = null, maxRetries = 15, retryDelay = 800) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryListen = () => {
      attempts++;

      const onError = (err) => {
        httpServer.removeListener('listening', onListening);

        if (err.code === 'EADDRINUSE') {
          if (attempts < maxRetries) {
            logger.warn(`⚠️ Port ${port} is currently busy (attempt ${attempts}/${maxRetries}). Waiting ${retryDelay}ms for lingering process to release...`);
            setTimeout(() => {
              tryListen();
            }, retryDelay);
          } else {
            logger.error(`❌ Port ${port} is already in use by another process after ${maxRetries} attempts.`);
            logger.error(`👉 Run 'npm run kill-port' to terminate any zombie process on port ${port}.`);
            process.exit(1);
          }
        } else {
          logger.error('HTTP server encountered an error:', err);
          reject(err);
        }
      };

      const onListening = () => {
        httpServer.removeListener('error', onError);
        logger.info(`🚀 Server running and listening on http://localhost:${port}`);
        resolve();
      };

      httpServer.once('error', onError);
      httpServer.once('listening', onListening);

      if (host) {
        httpServer.listen(port, host);
      } else {
        httpServer.listen(port);
      }
    };

    tryListen();
  });
};

const start = async () => {
  logger.info(`Starting server in ${config.NODE_ENV} mode...`);

  try {
    // 1. Initialize Database
    try {
      await connectMongo();
      // Ensure primary government nodal administrator & super admin exist for administrative login
      try {
        const { Admin } = await import('./modules/government/admins/infrastructure/model.js');
        const { syncAdminUserAuth } = await import('./modules/government/admins/application/helpers/admin-sync.helper.js');

        const existingAdmin = await Admin.findOne({ email: 'admin@jharkhand.gov.in' });
        if (!existingAdmin) {
          const superAdmin = new Admin({
            fullName: 'Government Super Administrator',
            username: 'admin',
            email: 'admin@jharkhand.gov.in',
            password: 'Admin@123456',
            mobileNumber: '9876543210',
            role: 'State Government Admin',
            primaryRole: 'Super Administrator',
            accessLevel: 'State Level Access',
            district: 'Ranchi',
            assignedDepartment: 'Higher & Technical Education',
            status: 'Active'
          });
          await superAdmin.save();
          await syncAdminUserAuth(superAdmin);
          logger.info('Default Super Admin initialized: admin@jharkhand.gov.in / Admin@123456');
        }

        const existingNodal = await Admin.findOne({ email: 'nodal@jharkhand.gov.in' });
        if (!existingNodal) {
          const defaultAdmin = new Admin({
            fullName: 'State Nodal Administrator',
            username: 'nodal_admin',
            email: 'nodal@jharkhand.gov.in',
            password: 'Nodal@123456',
            mobileNumber: '9876543211',
            role: 'State Nodal Officer',
            primaryRole: 'State Level Administrator',
            accessLevel: 'State Level Access',
            district: 'Ranchi',
            assignedDepartment: 'Higher & Technical Education',
            status: 'Active'
          });
          await defaultAdmin.save();
          await syncAdminUserAuth(defaultAdmin);
          logger.info('Default Nodal Administrator initialized: nodal@jharkhand.gov.in / Nodal@123456');
        }
      } catch (adminInitErr) {
        logger.warn('Admin bootstrap notice: ' + adminInitErr.message);
      }

      try {
        const { initFundAllocationWatcher } = await import('./modules/government/departments/infrastructure/fund-allocation-watcher.js');
        initFundAllocationWatcher();
      } catch (watcherErr) {
        logger.warn('Fund allocation watcher notice: ' + watcherErr.message);
      }
    } catch (dbErr) {
      logger.error('Failed to initialize MongoDB connection:', dbErr);
    }

    // 2. Start HTTP Server with Socket.IO
    server = http.createServer(app);
    initializeSocketServer(server);

    // 3. Listen on port with auto-retry if port was lingering from previous reload (dual-stack IPv4 & IPv6)
    await listenWithRetry(server, config.PORT, undefined, 15, 800);

    // 4. Initialize Background Workers
    initializeWorkers();

    // Handle process events for Graceful Shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      const forceShutdownTimeout = setTimeout(() => {
        logger.error('Shutdown timed out. Forcing immediate exit...');
        process.exit(1);
      }, 3000);

      try {
        // 1. Forcibly disconnect all Socket.IO clients and stop socket server
        await closeSocketServer();

        // 2. Forcibly close all active client HTTP connections (Keep-Alive) so the port is freed instantly
        if (server) {
          logger.info('Stopping HTTP server from accepting new traffic...');
          if (typeof server.closeAllConnections === 'function') {
            server.closeAllConnections();
          }
          if (typeof server.closeIdleConnections === 'function') {
            server.closeIdleConnections();
          }
          await new Promise((resolve) => {
            server.close(() => {
              logger.info('HTTP server stopped.');
              resolve();
            });
          });
        }

        // 3. Disconnect database cleanly
        await closeMongo();
        clearTimeout(forceShutdownTimeout);
        logger.info('Graceful shutdown completed successfully.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown connections cleanup:', err);
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
