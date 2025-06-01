/**
 * Simple logging utility for the NodeChain application
 * Uses console logging with timestamps for basic debugging
 */

/**
 * Gets formatted timestamp for log entries
 * @returns {string} ISO timestamp string
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Formats log message with timestamp and level
 * @param {string} level - Log level (INFO, ERROR, DEBUG, etc.)
 * @param {string} message - Log message
 * @returns {string} Formatted log entry
 */
const formatMessage = (level, message) => {
  return `[${getTimestamp()}] [${level}] ${message}`;
};

/**
 * Simple logger object with console-based logging
 */
const logger = {
  /**
   * Logs error messages to console
   * @param {string} message - Error message to log
   */
  error(message) {
    console.error(formatMessage('ERROR', message));
  },

  /**
   * Logs informational messages to console
   * @param {string} message - Info message to log
   */
  info(message) {
    console.log(formatMessage('INFO', message));
  },

  /**
   * Logs debug messages to console
   * @param {string} message - Debug message to log
   */
  debug(message) {
    console.log(formatMessage('DEBUG', message));
  },
};

export default logger;
