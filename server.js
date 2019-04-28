const express = require("express");
const {
  errorLogger,
  infoLogger,
  consoleLogger,
  uncaughtExc
} = require("./utils/logger");
const config = require("config");
const winston = require("winston");
const loginRoutes = require("./controllers/login");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(uncaughtExc);

app.use("/login", loginRoutes);

app.listen(config.get("port"), () => {
  consoleLogger.log({
    level: "info",
    message: `Server is running on port ${config.get("port")}`
  });
  // below code is for demonstration of default.json and production.json configarution
  // console.log(`${config.get("user.name")} ${config.get("user.surname")}`);
});

// require('./startup/loggin')();
// require('./startup/routes')(app);
// require('./startup/db')();
// config.configuration();
// require('./startup/validation')();
