const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.decode(token, config.get("secret-token"));
    if (user["isAdmin"] !== 1) {
      res.status(403).json({ error: 1, body: "Unauthorized request" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 1, message: "Invalid token" });
  }
};
