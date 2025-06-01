import logger from './logger.js';

/**
 * Simple error handling middleware for the NodeChain API
 * Catches errors and sends structured JSON responses
 */

/**
 * Main error handling middleware function
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  logger.error(`${statusCode} - ${message} - ${req.method} ${req.path}`);

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Creates a custom error with specific status code and message
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} Custom error object
 */
export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
