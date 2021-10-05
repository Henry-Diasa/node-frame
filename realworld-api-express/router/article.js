const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const articleCtrl = require("../controller/article");
const articleValidator = require("../validator/article");
// 获取文章列表
router.get("/", articleCtrl.getArticles);

// 获取用户关注的作者文章列表
router.get("/feed", async (req, res, next) => {
  try {
    res.send("get /feed");
  } catch (err) {
    next(err);
  }
});

// 获取文章
router.get("/:articleId", articleValidator.getArticle, articleCtrl.getArticle);

// 创建文章
router.post(
  "/",
  auth,
  articleValidator.createArticle,
  articleCtrl.createArticle
);

// 更新文章
router.put(
  "/:articleId",
  auth,
  articleValidator.updateArticle,
  articleCtrl.updateArticle
);

module.exports = router;
