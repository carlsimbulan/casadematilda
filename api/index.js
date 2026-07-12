// Vercel serverless entry point — re-exports the Express app
require('dotenv').config();
const app = require('../server/app');

module.exports = app;
