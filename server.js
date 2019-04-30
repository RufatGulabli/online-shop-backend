const express = require("express");
const { errorLogger, infoLogger, consoleLogger } = require("./utils/logger");
const config = require("config");
const winston = require("winston");
const loginRoutes = require("./controllers/login");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/login", loginRoutes);

// 404 - Not Found Http Handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  res.json({
    status: err.status,
    message: err.message
  });
});

// Express Error Handler
app.use((err, req, res, next) => {
  errorLogger.log({ level: "error", message: err.message });
  res.status(500).json({ message: "Internal server error" });
});

process.on("unhandledRejection", exc => {
  throw exc;
});

process.on("uncaughtException", exc => {
  errorLogger.log({ level: "error", message: err.message });
  console.log("Exit");
  setTimeout(() => {
    process.exit(1);
  }, 2000);
});

app.listen(config.get("port"), () => {
  consoleLogger.log({
    level: "info",
    message: `Server is running on port ${config.get("port")}`
  });
  // below code is for demonstration of default.json and production.json configarution
  // console.log(`${config.get("user.name")} ${config.get("user.surname")}`);
});
