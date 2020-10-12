// const http = require("http");
// 配置信息，将常规信息放入配置表中
const config = require("./utils/config.js");
const path = require("path");
// 路由配置表
const router = require("./routes/router");
const user = require("./routes/user");
// // fs.readFile('./demo.txt', (err,data)=>{
// //     if(err) return false

// //     console.log(data.toString('utf-8'));
// // })

// // console.log(__dirname);

// // 路径拼接，手动输入路径名，分隔符，文件名
// // 手动拼接路径容易引起路径字符重复或不同操作系统下文件分隔符不一样

// // console.log(path.join(__dirname+'file.js'));
// http
//   .createServer()
//   .on("request", (req, res) => {
//     // 获取请求的路径
//     // console.log(req.url);
//     // 要向服务器发送数据
//     // res.write()
//     // res.setHeader('Content-Type', 'text/html; utf-8;')
//     // // 关闭请求
//     // if(req.url === '/on'){
//     //     fs.readFile(path.join(__dirname, 'demo', 'index.html'), (err,data)=>{
//     //         if(err) return false;

//     //         res.end(data)
//     //     })
//     // }
//     // const url = req.url.toLowerCase();
//     context(req, res);
//     router(req, res);
//   })
//   .listen(config.port, () => {
//     console.log(`Listening on port ${config.port}`);
//   });

/**
 * Express
 */

const express = require("express");
const server = express();

const bodyParser = require("body-parser");
// 消息队列，用于会话。配合session使用
const flash = require("connect-flash");
const expressSession = require("express-session");
// 消息渲染器
const expressMessages = require("express-messages");
// 用户信息验证
const passport = require("passport");

// 添加模板引擎 http://expressjs.com/en/advanced/developing-template-engines.html
// views/view engine是固定的参数
server.set("views", path.join(__dirname, "pages")); // specify the views directory
server.set("view engine", "pug"); // register the template engine

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// session，会话信息控制
server.use(
  expressSession({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);
// 消息队列
server.use(flash());
server.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// 通行证
require("./utils/passport")(passport);
server.use(passport.initialize());
server.use(passport.session());

// 表单验证
// 处理静态资源
const static = express.static(path.join(__dirname, "public"));
// 表示在处理根路径的时候将根路径处理成./public；比如静态资源./css/index.css，实际访问的路径是./public/css/index.css
server.use("/", static);

// 路由和响应
server.use(router);
server.use(user);

// 动态路由
// server.get("/news/:year/:month/:date", (req, res) => {
//   const params = req.params;
//   res.send(`Year: ${params.year},Month: ${params.month},Date: ${params.date}`);
// });

server.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
