const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const loginRoute = require("../controllers/login");
const {
  expressErrorHandler,
  pageNotFoundErrorHandler
} = require("../middlewares/error-handlers");

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.options("*", cors());
  app.use("/login", loginRoute);
  app.use(expressErrorHandler);
  app.use(pageNotFoundErrorHandler);
};
