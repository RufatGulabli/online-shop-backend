const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/", (req, res, next) => {
  res.json("Hello World");
});

module.exports = router;
