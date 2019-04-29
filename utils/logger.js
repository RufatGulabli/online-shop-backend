const { createLogger, format, transports } = require("winston");

const consoleLogger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(
      info => `${info.timestamp} => ${info.level} => ${info.message}`
    )
  ),
  transports: [
    new transports.Console({
      level: "debug"
    })
  ]
});

const errorLogger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(
      info => `${info.timestamp} => ${info.level} => ${info.message}`
    )
  ),
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      colorise: true,
      filename: `${__dirname}/../logs/errorLogs.log`,
      timestamp: true,
      handleExceptions: false
    })
  ]
});

const infoLogger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(
      info => `${info.timestamp} => ${info.level} => ${info.message}`
    )
  ),
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      colorise: true,
      filename: `${__dirname}/../logs/infoLogs.log`
    })
  ]
});

const uncaughtExc = () => {};

module.exports = {
  errorLogger,
  infoLogger,
  consoleLogger,
  uncaughtExc
};
