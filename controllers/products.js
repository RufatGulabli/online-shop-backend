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
      message: JSON.stringify(req.originalUrl)
    });
    const sortColumn = req.query["sortColumn"] || "id";
    const orderBy = req.query["sortOrder"] || "asc";
    const limit = parseInt(req.query["pageSize"]) || 10;
    const offset = parseInt(req.query["pageNumber"]) || 1;
    const filter = req.query["filter"] || "";
    const products = await db_connection("products")
      .select("*")
      .where("title", "ilike", "%".concat(filter).concat("%"))
      .orderBy(sortColumn, orderBy)
      .limit(limit)
      .offset((offset - 1) * limit);
    console.log(products);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/count", [verifyToken, verifyAdmin], async (req, res, next) => {
  try {
    let total = await db_connection("products")
      .count("id")
      .first();
    res.status(200).json(total["count"]);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let param = req.params["id"];
    const _id = parseInt(param);
    if (isNaN(_id)) {
      res.status(400).json({ error: 1, body: "ID must be a number" });
    }
    const products = await db_connection("products")
      .select("*")
      .where({
        id: _id
      });
    res.status(200).json(products);
  } catch (ex) {
    next(ex);
  }
});

router.delete("/:id", [verifyToken, verifyAdmin], async (req, res, next) => {
  try {
    let productId = parseInt(req.params["id"]);
    if (isNaN(productId)) {
      res.status(400).json({ error: 1, body: "ID must be a number" });
    }
    let rowsAffected = await db_connection("products")
      .where("id", productId)
      .delete();
    if (!rowsAffected) {
      res.status(400).json("There is not a product qith a given ID");
    }
    res.status(200).json(rowsAffected);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
