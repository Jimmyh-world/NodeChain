const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message) => {
  return `[${getTimestamp()}] [${level}] ${message}`;
};

const logger = {
  error(message) {
    console.error(formatMessage('ERROR', message));
  },

  info(message) {
    console.log(formatMessage('INFO', message));
  },

  debug(message) {
    console.log(formatMessage('DEBUG', message));
  },
};

export default logger;
