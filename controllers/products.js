const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");
const { infoLogger, errorLogger } = require("../utils/logger");
const { validateProduct } = require("../utils/bodyValidators");
const verifyToken = require("../middlewares/verify-token");
const verifyAdmin = require("../middlewares/verify-admin");

router.post("/", [verifyToken, verifyAdmin], async (req, res, next) => {
  try {
    infoLogger.log({
      level: "info",
      message: JSON.stringify(req.body)
    });
    const { id, ...product } = req.body;
    const { error } = validateProduct(product);
    if (error)
      return res.status(400).json({ error: 1, body: error.details[0].message });
    const result = await db_connection("products").insert({
      title: product.title,
      price: product.price,
      category: product.category,
      imageurl: product.imageUrl
    });
    res.status(200).json(result.rowCount);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
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
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/count", async (req, res, next) => {
  try {
    let total = await db_connection("products")
      .count("id")
      .first();
    res.status(200).json(total["count"]);
  } catch (err) {
    next(err);
  }
});

router.get("/getCountByCategory/:id", async (req, res, next) => {
  try {
    let categoryId = req.params.id;
    if (isNaN(categoryId)) {
      return res.status(404).json({ error: 1, body: "Category Id must be a number." });
    }
    let totalCount = await db_connection("products")
      .count("id")
      .where("category", categoryId)
      .first();
    res.status(200).json(totalCount.count);
  } catch (err) {
    next(err);
  }
});

router.get("/getCount/ByFilter/:filter", async (req, res, next) => {
  try {
    const keyword = req.params.filter;
    let totalCount = await db_connection("products")
      .count("id")
      .where("title", "ilike", "%".concat(keyword).concat("%"))
      .first();
    res.status(200).json(totalCount.count);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    infoLogger.log({ level: "info", message: JSON.stringify(req.originalUrl) });
    const productId = parseInt(req.params["id"]);
    if (isNaN(productId) || productId <= 0) {
      errorLogger.log({
        level: "error",
        message: JSON.stringify(req.originalUrl + "::").concat(
          JSON.stringify(req.params)
        )
      });
      return res.status(400).json({ error: 1, body: "ID must be a number" });
    }
    const product = await db_connection("products")
      .select("*")
      .where({
        id: productId
      });
    res.status(200).json(product[0]);
  } catch (ex) {
    next(ex);
  }
});

router.put("/", [verifyToken, verifyAdmin], async (req, res, next) => {
  try {
    infoLogger.log({
      level: "info",
      message:
        JSON.stringify("PUT::" + req.originalUrl) +
        "::" +
        JSON.stringify(req.body)
    });
    const { error } = validateProduct(req.body);
    const { id, title, price, category, imageUrl } = req.body;
    if (!id) return res.status(400).json({ error: 1, body: "ID is required" });
    if (error)
      return res.status(400).json({ error: 1, body: error.details[0].message });
    const product = await db_connection("products")
      .select("*")
      .where({
        id: id
      });
    let affectedRow = await db_connection("products")
      .where("id", id)
      .update({
        title: title,
        price: price,
        category: category,
        imageurl: imageUrl
      });
    res.status(200).json(affectedRow);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", [verifyToken, verifyAdmin], async (req, res, next) => {
  try {
    let productId = parseInt(req.params["id"]);
    if (isNaN(productId) || productId < 0) {
      return res.status(400).json({ error: 1, body: "ID must be a number" });
    }
    let rowsAffected = await db_connection("products")
      .where("id", productId)
      .delete();
    if (!rowsAffected) {
      return res.status(400).json("There is not a product with a given ID");
    }
    res.status(200).json(rowsAffected);
  } catch (err) {
    next(err);
  }
});

router.get("/category/:id", async (req, res, next) => {
  try {
    let categoryId = +req.params["id"];
    const limit = parseInt(req.query["pageSize"]) || 5;
    const offset = parseInt(req.query["pageNumber"]) || 1;

    if (isNaN(categoryId)) {
      errorLogger.log({ level: "error", message: req.params["id"] });
      return res.status(400).json("Category must be a number");
    }
    const products = await db_connection("products")
      .select("*")
      .where("category", categoryId)
      .orderBy("title", "ASC")
      .limit(limit)
      .offset((offset - 1) * limit);

    if (!products.length)
      return res
        .status(404)
        .json(`There is not any category with given id : ${categoryId}`);

    res.status(200).json(products);

  } catch (err) {
    next(err);
  }
});

module.exports = router;
