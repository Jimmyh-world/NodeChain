import express from 'express';
import blockRoutes from './routes/blockRoutes.js';
import { errorHandler } from './utils/errorHandler.js';
import logger from './utils/logger.js';

/**
 * NodeChain REST API Server
 * Simple Express server for blockchain operations
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// API Routes
app.use('/blocks', blockRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`NodeChain API server started on port ${PORT}`);
});

export default app;
