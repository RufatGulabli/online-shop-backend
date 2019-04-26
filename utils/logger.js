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
      filename: `${__dirname}/../logs/errorLogs.log`
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
      filename: `${__dirname}/../logs/infoLogs.log`
    })
  ]
});

module.exports = {
  errorLogger,
  infoLogger,
  consoleLogger
};
