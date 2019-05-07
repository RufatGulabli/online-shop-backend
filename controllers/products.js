const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");
const { infoLogger } = require("../utils/logger");
const { validateProduct } = require("../utils/bodyValidators");

router.post("/", async (req, res, next) => {
  try {
    infoLogger.log({
      level: "info",
      message: JSON.stringify(req.body)
    });
    const { error } = validateProduct(req.body);
    const { title, price, category, imageUrl } = req.body;
    if (error)
      return res.status(400).json({ error: 1, body: error.details[0].message });

    const result = await db_connection("products").insert({
      title: title,
      price: price,
      category: category,
      imageurl: imageUrl
    });
    res.status(200).json(result.rowCount);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
