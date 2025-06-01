import express from 'express';
import blockRoutes from './routes/blockRoutes.js';
import { errorHandler } from './utils/errorHandler.js';
import logger from './utils/logger.js';

/**
 * NodeChain REST API Server
 * Provides HTTP endpoints for blockchain operations
 * Built with Express.js using ES6 modules
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NodeChain API is running',
    version: '1.0.0',
    endpoints: {
      'GET /blocks': 'List all blocks',
      'POST /blocks': 'Create new block',
      'GET /blocks/:id': 'Get block by index or hash',
      'GET /blocks/stats': 'Get blockchain statistics',
    },
  });
});

// API Routes
app.use('/blocks', blockRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

// Centralized error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`NodeChain API server started on port ${PORT}`);
  logger.info(`Visit http://localhost:${PORT} for API information`);
});

export default app;
