const serverlessExpress = require('@codegenie/serverless-express');
const express = require('express');
const cors = require('cors');
const compression = require('compression');

// Import routes
const stacRoutes = require('./routes/stac');

const app = express();

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

exports.handler = serverlessExpress({ app });