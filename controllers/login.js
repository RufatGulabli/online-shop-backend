const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const username = req.body.username;
    if (!username) throw new Error("Ayeeee");
    res.json(username);
  } catch (exc) {
    next(exc);
  }
});

module.exports = router;
