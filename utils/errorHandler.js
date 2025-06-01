import logger from './logger.js';

/**
 * Centralized error handling middleware for the NodeChain API
 * Catches all errors, logs them appropriately, and sends structured JSON responses
 */

/**
 * Main error handling middleware function
 * Processes different types of errors and returns appropriate HTTP responses
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error details
  logger.error(
    `${statusCode} - ${message} - ${req.method} ${req.path} - ${req.ip}`
  );
  logger.error(`Stack trace: ${err.stack}`);

  // Handle specific error types
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed: ' + err.message;
  }

  // Handle cast errors (invalid data types)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format provided';
  }

  // Blockchain-specific errors
  if (err.name === 'BlockchainError') {
    statusCode = 422;
    message = 'Blockchain operation failed: ' + err.message;
  }

  // Mining errors
  if (err.name === 'MiningError') {
    statusCode = 500;
    message = 'Block mining failed: ' + err.message;
  }

  // Send structured error response
  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Creates a custom error with specific status code and message
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} name - Error name/type
 * @returns {Error} Custom error object
 */
export const createError = (message, statusCode = 500, name = 'Error') => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.name = name;
  return error;
};

/**
 * Async wrapper to catch errors in async route handlers
 * Eliminates need for try-catch blocks in every async controller
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
