const winston = require('winston');
const { logLevels } = require('@config/vars');
// define the custom settings for each transport (file, console)
const options = {
  file              : {
    level           : logLevels.file,
    filename        : `logs/app.log`,
    handleExceptions: true,
    json            : true,
    maxsize         : 5242880, // 5MB
    maxFiles        : 5,
    colorize        : false,
    format          : winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  },
  console           : {
    level           : logLevels.console,
    handleExceptions: true,
    json            : false,
    colorize        : true,
    format          : winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports  : [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError : false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports = {
  logger: logger
};
