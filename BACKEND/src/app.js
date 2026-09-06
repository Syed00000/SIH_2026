import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './shared/errors/errorHandler.js';
import { NotFoundError } from './shared/errors/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './modules/auth/presentation/routes.js';
import heisRoutes from './modules/government/heis/presentation/routes.js';
import industryRoutes from './modules/government/industries/presentation/routes.js';
import adminRoutes from './modules/government/admins/presentation/routes.js';
import overviewRoutes from './modules/government/overview/presentation/routes.js';
import universityRoutes from './modules/university/presentation/routes.js';
import citizenRoutes from './modules/citizen/presentation/routes.js';
import clarificationRoutes from './modules/clarification/presentation/routes.js';
import grantRoutes from './modules/government/grants/routes.js';
import industryFundRoutes from './modules/industry/funds/routes.js';
import industryExpertRoutes from './modules/industry/experts/routes.js';
import industryTechRoutes from './modules/industry/tech/routes.js';
import mediaRoutes from './modules/media/presentation/routes.js';

const app = express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.resolve(__dirname, '../public/uploads')));


app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (isDbConnected) {
    res.status(200).json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: { mongodb: 'UP' }
    });
  } else {
    res.status(503).json({
      status: 'DOWN',
      services: { mongodb: 'DOWN' }
    });
  }
});

// Versioned API Modules
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/heis', heisRoutes);
app.use('/api/v1/heis', heisRoutes);
app.use('/api/v1/government/heis', heisRoutes);

// Industry Fund & Grant Management System
app.use('/api/v1/industry/funds', industryFundRoutes);
app.use('/api/v1/industries/funds', industryFundRoutes);
app.use('/api/v1/industry/experts', industryExpertRoutes);
app.use('/api/v1/industries/experts', industryExpertRoutes);
app.use('/api/v1/industry/tech', industryTechRoutes);
app.use('/api/v1/industries/tech', industryTechRoutes);

app.use('/api/v1/admin/industries', industryRoutes);
app.use('/api/v1/industries', industryRoutes);
app.use('/api/v1/government/industries', industryRoutes);

app.use('/api/v1/government/admins', adminRoutes);
app.use('/api/v1/government/overview', overviewRoutes);
app.use('/api/v1/government/funds', grantRoutes);
app.use('/api/v1/university', universityRoutes);
app.use('/api/v1/citizen', citizenRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/clarification-chat', clarificationRoutes);
app.use('/api/clarification-chat', clarificationRoutes);

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
});

app.use(errorHandler);

export default app;
export { app };
