const express = require("express");

const router = express.Router();
const userCtrl = require("../controller/user");
const userValidator = require("../validator/user");
const auth = require('../middleware/auth')
// 登录
router.post("/users/login", userValidator.login, userCtrl.login);
// 注册
router.post(
  "/users",
  userValidator.register,
  userCtrl.register // 通过验证执行具体的控制处理
);
// 获取单用户
router.get("/user", auth, userCtrl.getCurrentUser);
// 更新
router.put("/user", auth, userCtrl.updateCurrentUser);

module.exports = router;
