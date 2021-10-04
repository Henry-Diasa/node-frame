const express = require("express");

const router = express.Router();

router.get("/foo", (req, res) => {
  res.send("get /foo");
});

router.post("/foo", (req, res) => {
  res.send("post /foo");
});

module.exports = router
