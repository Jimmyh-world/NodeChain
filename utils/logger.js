import fs from 'fs';
import path from 'path';

/**
 * Centralized logging utility for the NodeChain application
 * Provides structured logging with timestamps for debugging and monitoring
 */
class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.errorLogPath = path.join(this.logDir, 'error.log');
    this.appLogPath = path.join(this.logDir, 'app.log');

    // Ensure logs directory exists
    this.ensureLogDirectory();
  }

  /**
   * Ensures the logs directory exists, creates it if it doesn't
   * @private
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Gets formatted timestamp for log entries
   * @returns {string} ISO timestamp string
   * @private
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Formats log message with timestamp and level
   * @param {string} level - Log level (INFO, ERROR, DEBUG, etc.)
   * @param {string} message - Log message
   * @returns {string} Formatted log entry
   * @private
   */
  formatMessage(level, message) {
    return `[${this.getTimestamp()}] [${level}] ${message}\n`;
  }

  /**
   * Logs error messages to error.log file
   * @param {string} message - Error message to log
   */
  error(message) {
    const formattedMessage = this.formatMessage('ERROR', message);
    fs.appendFileSync(this.errorLogPath, formattedMessage);
    console.error(formattedMessage.trim());
  }

  /**
   * Logs informational messages to app.log file
   * @param {string} message - Info message to log
   */
  info(message) {
    const formattedMessage = this.formatMessage('INFO', message);
    fs.appendFileSync(this.appLogPath, formattedMessage);
    console.log(formattedMessage.trim());
  }

  /**
   * Logs debug messages to app.log file
   * @param {string} message - Debug message to log
   */
  debug(message) {
    const formattedMessage = this.formatMessage('DEBUG', message);
    fs.appendFileSync(this.appLogPath, formattedMessage);
    console.log(formattedMessage.trim());
  }
}

// Export singleton instance
export default new Logger();
