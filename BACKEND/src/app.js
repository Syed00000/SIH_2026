import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { randomUUID } from 'crypto';
import config from './shared/config/index.js';
import cookieParser from './shared/security/cookies.js';
import rateLimiter from './shared/security/rate-limiter.js';
import errorHandler from './shared/errors/errorHandler.js';
import { NotFoundError } from './shared/errors/AppError.js';
import { getDb } from './infrastructure/database/mongo/client.js';

// Route Imports
import authRoutes from './modules/auth/presentation/routes.js';
import heisRoutes from './modules/government/heis/presentation/routes.js';
import industryRoutes from './modules/government/industries/presentation/routes.js';
import adminRoutes from './modules/government/admins/presentation/routes.js';
import overviewRoutes from './modules/government/overview/presentation/routes.js';

const app = express();

// 1. Correlation ID Middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || randomUUID();
  req.id = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
});

// 2. Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      const allowedOrigins = Array.isArray(config.CORS_ORIGINS) ? config.CORS_ORIGINS : [config.CORS_ORIGINS];
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-requested-with', 'Accept']
  })
);

// 3. Body Limits & Parser Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser);

// 4. Global Distributed Rate Limiter
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    keyPrefix: 'rl:global'
  })
);

// 5. Health & Observability Endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'UP',
    message: 'SIH 2026 Modular Monolithic API Server'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

app.get('/health/live', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/health/ready', async (req, res, next) => {
  try {
    const mongoDb = getDb();
    await mongoDb.command({ ping: 1 });
    
    res.json({
      status: 'UP',
      services: {
        mongodb: 'UP'
      }
    });
  } catch (err) {
    res.status(503).json({
      status: 'DOWN',
      services: {
        mongodb: 'DOWN'
      }
    });
  }
});

// 6. Versioned API Modules
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/heis', heisRoutes);
app.use('/api/v1/heis', heisRoutes);
app.use('/api/v1/admin/industries', industryRoutes);
app.use('/api/v1/industries', industryRoutes);
app.use('/api/v1/government/admins', adminRoutes);
app.use('/api/v1/government/overview', overviewRoutes);

// 7. Route fallback (404)
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
});

// 8. Centralized Global Error Handler
app.use(errorHandler);

export default app;
export { app };
