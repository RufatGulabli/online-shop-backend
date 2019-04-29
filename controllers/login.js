const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {
  throw new Error("Ayeee");
});

module.exports = router;
