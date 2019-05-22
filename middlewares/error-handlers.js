const { errorLogger } = require("../utils/logger");

// Express Error Handler
const expressErrorHandler = function(err, req, res, next) {
  errorLogger.log({ level: "error", message: err });
  res
    .status(500)
    .json({ status: 500, body: err.message || "Internal Server Error" });
};

// 404 - Not Found Http Handler
const pageNotFoundErrorHandler = function(req, res, next) {
  let err = new Error("Not Found");
  res.status(404).json({
    error: 1,
    body: err.message
  });
};

module.exports = {
  expressErrorHandler,
  pageNotFoundErrorHandler
};
