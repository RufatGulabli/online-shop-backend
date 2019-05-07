const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");

router.get("/", async (req, res, next) => {
  try {
    const categories = await db_connection("categories").select();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
