import request from 'supertest';
import { jest } from '@jest/globals';

// Mock dependencies of app.js before loading
jest.unstable_mockModule('../../src/infrastructure/database/mongo/client.js', () => ({
  getDb: () => ({
    command: jest.fn().mockImplementation(async (cmd) => {
      if (cmd.ping === 1) return { ok: 1 };
      throw new Error('Database ping failed');
    })
  }),
  connectMongo: jest.fn(),
  closeMongo: jest.fn()
}));

// Import app after mocking
const { app } = await import('../../src/app.js');

describe('Health Endpoints Integration Tests', () => {
  it('GET / - should return UP status and server message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.message).toContain('Modular Monolithic API Server');
  });

  it('GET /health - should return UP and timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health/live - should return UP', async () => {
    const res = await request(app).get('/health/live');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('GET /health/ready - should return UP when databases are responsive', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.services.mongodb).toBe('UP');
    expect(res.body.services.redis).toBeUndefined(); // Redis should be removed
  });
});
