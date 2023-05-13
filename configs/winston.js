const fs = require('fs');
const { format: _format } = require('date-fns');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logDir = __dirname + '/../logs';

// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

const dailyRotateFileTransport = new transports.DailyRotateFile({
  level: 'http',
  dirname: logDir,
  filename: `info_%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const errorTransport = new transports.DailyRotateFile({
  level: 'error',
  dirname: logDir + '/error',
  filename: 'error_%DATE%.log',
  datePattern: 'YYYY-MM-DD',
});

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf((info) => ` ${info.level}: ${info.message}`),
      ),
    }),
    errorTransport,
    dailyRotateFileTransport,
  ],
});

(() => {
  // if (process.env.pm_id === '0') {
  //   logger.info(`Server Start: ${_format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' })}`);
  // }
  logger.info(`Server Start: ${_format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' })}`);
})();

const stream = {
  write: (message) => {
    logger.info(message);
  },
};

const getErrorObject = (req, err) => {
  return {
    timestamp: _format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' }),
    url: decodeURI(req.url),
    body: req.body,
    error: {
      status: err.status,
      message: err.message,
      stack: err.stack,
    },
    user: {
      id: req.user ? req.user.id : null,
      'user-agent': req.headers['user-agent'],
    },
  };
};

module.exports = {
  logger,
  stream,
  getErrorObject,
};
