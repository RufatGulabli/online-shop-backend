const express = require("express");
const { errorLogger, infoLogger, consoleLogger } = require("./utils/logger");
const config = require("config");

const app = express();

app.get("/", (req, res) => {
  try {
    throw new Error("Ayeeeee");
    logger.infoLogger({
      level: "info",
      message:
        req.baseUrl + " => Header : " + req.headers.host + " => Ip: " + req.ip
    });
    res.json("Hello World");
  } catch (e) {
    errorLogger.error({ level: "error", message: e.message });
  }
});

app.listen(config.get("port"), () => {
  consoleLogger.log({
    level: "info",
    message: `Server is running on port ${config.get("port")}`
  });
  // console.log(`${config.get("user.name")} ${config.get("user.surname")}`);
});
