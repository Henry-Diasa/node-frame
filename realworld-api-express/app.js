const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const router = require('./router')
const errorHandler = require('./middleware/error-handler')
const app = express();
require('./model')
const PORT = process.env.port || 3000;
// 中间件
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())

// 挂载路由
app.use('/api', router)

// 错误处理
app.use(errorHandler())
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
