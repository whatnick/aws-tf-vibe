const serverlessExpress = require('@vendia/serverless-express');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Import routes
const stacRoutes = require('./routes/stac');

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

app.use('/api', stacRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

exports.handler = serverlessExpress({ app });