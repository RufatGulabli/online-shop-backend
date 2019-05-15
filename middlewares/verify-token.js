const jwt = require("jsonwebtoken");
const config = require("config");
const { infoLogger } = require("../utils/logger");

module.exports = (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ error: 1, message: "Unauthorized request" });
    }
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: 1, message: "Unauthorized request" });
    }
    jwt.verify(token, config.get("secret-token"));

    next();
  } catch (err) {
    return res.status(401).json({ error: 1, message: "Invalid token" });
  }
};
