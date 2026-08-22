import logger from '../../shared/logger/index.js';

class JobQueue {
  constructor() {
    this.handlers = new Map();
  }

  registerWorker(jobName, handler) {
    if (this.handlers.has(jobName)) {
      logger.warn(`Handler for job "${jobName}" is already registered. Overwriting.`);
    }
    this.handlers.set(jobName, handler);
    logger.info(`Worker registered for background job: "${jobName}"`);
  }

  async add(jobName, data = {}) {
    logger.debug({ jobName, data }, `Enqueueing background job: "${jobName}"`);

    setImmediate(async () => {
      const handler = this.handlers.get(jobName);
      if (!handler) {
        logger.error(`No handler registered for background job: "${jobName}"`);
        return;
      }

      try {
        logger.info(`Worker starting background job: "${jobName}"`);
        await handler(data);
        logger.info(`Worker successfully completed background job: "${jobName}"`);
      } catch (error) {
        logger.error({ error, jobName, data }, `Worker failed executing background job: "${jobName}"`);
      }
    });
  }
}

export const queue = new JobQueue();
export default queue;
