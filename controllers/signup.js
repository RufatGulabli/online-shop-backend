const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { infoLogger, errorLogger } = require("../utils/logger");
const { validateSignUp } = require("../utils/bodyValidators");

router.post("", async (req, res, next) => {
    try {
        infoLogger.log({
            level: "info",
            message: JSON.stringify(req.body.email + "::" + req.hostname)
        });

        let { firstName, lastName, email, password } = req.body;
        const { error } = validateSignUp({
            firstName, lastName, email, password
        });
        if (error) {
            errorLogger.error({
                level: "error",
                message: error.details[0].message
            });
            return res.status(400).json({ error: 1, body: error.details[0].message });
        }

        const fullname = firstName.trim().concat(` ${lastName.trim()}`);
        let emailExists = await db_connection("users")
            .where({
                email: email
            })
            .select("*");
        if (emailExists.length > 0)
            return res.status(400).json({ error: 1, body: "Email address already exists." });

        const hashedPassword = bcrypt.hashSync(password);

        const userId = await db_connection("users").insert({
            email: email,
            password: hashedPassword,
            fullname: fullname,
            isadmin: 0
        }).returning("id");
        if (userId > 0) {
            const token = jwt.sign(
                {
                    id: userId,
                    email: email,
                    fullname: fullname,
                    isAdmin: 0
                },
                config.get("secret-token"),
                { expiresIn: "1d" }
            );
            res.setHeader("authorization", "Bearer " + token);
            res.status(200).json(token);
        }

    } catch (exc) {
        next(exc);
    }
});

module.exports = router;