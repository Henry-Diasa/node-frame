const express = require("express");

const router = express.Router();

// 获取用户资料
router.get("/profiles/:username", async (req, res, next) => {
  try {
    res.send("get /profiles/:username");
  } catch (err) {
    next(err);
  }
});
// 关注用户
router.post("/profiles/:username/follow", async (req, res, next) => {
  try {
    res.send("post /profiles/:username/follow");
  } catch (err) {
    next(err);
  }
});

// 取消关注用户
router.delete("/profiles/:username/follow", async (req, res, next) => {
  try {
    res.send("delete /profiles/:username/follow");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
