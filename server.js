const http = require("http");
const url = require("url");
const _ = require("lodash");

// 创建请求
// 获取和解析URL
// 根据路径和请求方法设置响应，请求路径可以是字符串，也可以是正则表达式；设置静态资源的处理方式
// 渲染模板（ejs, pug）

class Server {
  constructor() {
    this.server = http.createServer();
    this.routes = [
      {
        route: "/",
        method: "get",
        callback: (req, res) => {
          res.end("Hello Node");
        },
      },
    ];
    this.server.on("request", (req, res) => {
      const index = _.findIndex(this.routes, {
        route: req.url,
      });
      console.log(index);
      if (index !== -1) {
        this.routes[index].callback(req, res);
      } else {
        res.end("Not Found");
      }
    });
  }
  run(port, callback) {
    this.server.listen(port, callback);
  }
  addRouter(route, method, callback) {
    this.routes.push({
      route,
      method: method.toLowerCase(),
      callback,
    });
  }
}

const s = new Server();
const port = 8080;
s.run(port, () => {
  console.log(`Starting server on port ${port}`);
});

s.addRouter("/submit", "get", (req, res) => {
  res.end("Hello Submit");
});
