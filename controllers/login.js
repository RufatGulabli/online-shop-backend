const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { infoLogger } = require("../utils/logger");
const { validateLogin } = require("../utils/bodyValidators");

router.post("/", async (req, res, next) => {
  try {
    infoLogger.log({
      level: "info",
      message: JSON.stringify(req.body)
    });
    let { email, password } = req.body;
    const { error } = validateLogin(req.body);

    if (error)
      return res.status(400).json({ error: 1, body: error.details[0].message });

    let user = await db_connection("users")
      .where({
        email: email
      })
      .select("*");

    if (user.length === 0)
      return res.status(400).json({ error: 1, body: "User does not exist" });

    await bcrypt.compare(password, user[0].password, (err, result) => {
      if (err) next(err);
      else {
        if (result) {
          const token = jwt.sign(
            {
              id: user[0].id,
              email: user[0].email,
              fullname: user[0].fullname,
              isAdmin: user[0].isadmin
            },
            config.get("secret-token"),
            { expiresIn: "1 hour" }
          );
          res.setHeader("authorization", "Bearer " + token);
          res.status(200).json(token);
        } else {
          res
            .status(400)
            .json({ error: 1, body: "Invalid email or password!" });
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
