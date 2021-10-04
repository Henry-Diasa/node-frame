const express = require("express");
const app = express();

const router = require("./middle-route");
// 不做任何限定的中间件
app.use(function (req, res, next) {
  console.log("Time", Date.now());
  next();
});

// 限定请求路径
// app.use("/user/:id", function (req, res, next) {
//   console.log("request type", req.method);
//   next();
// });

// 多个处理函数
// app.use(
//   "/user/:id",
//   function (req, res, next) {
//     console.log("request url", req.originalUrl);
//     next(); // 当前处理栈的下一个
//   },
//   function (req, res, next) {
//     console.log("request type", req.method);
//     next(); // 脱离当前栈
//   }
// );

// next('route')

// app.get(
//   "/user/:id",
//   function (req, res, next) {
//     if (req.params.id === "0") next("route");
//     else next();
//   },
//   function (req, res, next) {
//     res.send("regular");
//   }
// );

// 中间件放在数组中
function logUrl(req, res, next) {
  console.log("request url", req.originalUrl);
  next();
}
function logMethod(req, res, next) {
  console.log("request type", req.method);
  next();
}

var logStuff = [logUrl, logMethod];

app.get("/", function (req, res, next) {
  res.send("hello");
});
// app.get("/user/:id", function (req, res, next) {
//   res.send("special");
// });

app.get("/user/:id", logStuff, function (req, res, next) {
  res.send("user info");
  //  触发错误中间件
  next({
    message: "错误信息",
  });
});
// 挂载路由
// app.use(router);

// 给路由限定访问前缀
app.use("/abc", router);

// 所有的路由处理之后，处理404内容
app.use((req, res, next) => {
  res.status(404).send("404 not found");
});
// 在所有的中间件之后挂载错误处理中间件
app.use((err, req, res, next) => {
  console.log("错误");
  res.status(500).json({
    error: err.message,
  });
});

app.listen(3000, () => {
  console.log("server is listening at 3000");
});
