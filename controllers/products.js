const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");
const { infoLogger } = require("../utils/logger");
const { validateProduct } = require("../utils/bodyValidators");
const verifyToken = require("../middlewares/verify-token");
const verifyAdmin = require("../middlewares/verify-admin");

router.post("/", [verifyToken, verifyAdmin], async (req, res, next) => {
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

router.get("/", [verifyToken, verifyAdmin], async (req, res, next) => {
  try {
    infoLogger.log({
      level: "info",
      message: JSON.stringify("GET: /products::".concat(req.hostname))
    });
    const products = await db_connection("products").select("*");
    res.status(200).json({ error: 0, body: products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
