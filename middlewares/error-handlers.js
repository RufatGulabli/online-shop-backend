const { errorLogger } = require("../utils/logger");

// Express Error Handler
const expressErrorHandler = function(err, req, res, next) {
  errorLogger.log({ level: "error", message: err.message });
  res.status(500).json({ status: 500, body: "Internal Server Error" });
};

// 404 - Not Found Http Handler
const pageNotFoundErrorHandler = function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  res.json({
    status: err.status,
    body: err.message
  });
};

module.exports = {
  expressErrorHandler,
  pageNotFoundErrorHandler
};
