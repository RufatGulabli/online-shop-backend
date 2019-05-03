const express = require("express");
const { errorLogger, consoleLogger } = require("./utils/logger");
const config = require("config");

const app = express();
require("./routes/routes")(app);

process.on("unhandledRejection", exc => {
  throw exc;
});

process.on("uncaughtException", exc => {
  errorLogger.log({ level: "error", message: exc.message });
  console.log("Exit");
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

app.listen(config.get("port"), () => {
  consoleLogger.log({
    level: "info",
    message: `Server is running on port ${config.get("port")}`
  });
  // below code is for demonstration of default.json and production.json configarution
  // console.log(`${config.get("user.name")} ${config.get("user.surname")}`);
});
