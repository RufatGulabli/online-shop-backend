const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");
const Joi = require("joi");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const config = require("config");
const verify_token_middleware = require("../middlewares/verify-token");

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    let { email, password } = req.body;
    const { error } = validate(req.body);

    if (error)
      return res.status(400).json({ error: 1, body: error.details[0].message });

    let user = await db_connection("users")
      .where({
        email: email
      })
      .select("*");

    if (user.length === 0)
      return res
        .status(400)
        .json({ error: 1, message: "Invalid email or password!" });

    await bcrypt.compare(password, user[0].password, (err, result) => {
      if (err) next(err);
      else {
        if (result) {
          const token = jwt.sign(
            {
              id: user[0].id,
              email: user[0].email,
              fullname: user[0].fullname
            },
            config.get("secret-token"),
            { expiresIn: "1 hour" }
          );
          res.setHeader("authorization", "Bearer " + token);
          res.status(200).json(token);
        } else {
          res
            .status(400)
            .json({ error: 1, message: "Invalid email or password!" });
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", verify_token_middleware, async (req, res, next) => {
  res.json("Success");
});

function validate(body) {
  const schema = {
    email: Joi.string()
      .email()
      .min(10)
      .max(156)
      .required(),
    password: Joi.string()
      .min(8)
      .max(64)
      .required()
  };
  return Joi.validate(body, schema);
}

module.exports = router;
