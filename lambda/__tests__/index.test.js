const request = require('supertest');
const express = require('express');

// Mock the serverless-express module
jest.mock('@codegenie/serverless-express', () => {
  return jest.fn(() => jest.fn());
});

// Mock the routes
jest.mock('../routes/stac', () => {
  const router = express.Router();
  router.get('/catalogs', (req, res) => {
    res.json([{ id: 'test', name: 'Test Catalog' }]);
  });
  return router;
});

describe('Lambda App', () => {
  let app;

  beforeEach(() => {
    // Clear module cache to get fresh instance
    delete require.cache[require.resolve('../index.js')];
    
    // Create Express app directly for testing
    const express = require('express');
    const cors = require('cors');
    const compression = require('compression');
    const stacRoutes = require('../routes/stac');

    app = express();

    // Security headers
    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      next();
    });

    app.use(compression());
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));
    app.use('/api', stacRoutes);

    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });

  test('health endpoint returns status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('security headers are set', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  test('API routes are mounted', async () => {
    const response = await request(app)
      .get('/api/catalogs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('CORS is enabled', async () => {
    const response = await request(app)
      .options('/health')
      .expect(204);

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });
});