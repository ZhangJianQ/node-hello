const querystring = require("querystring");
// mongodb连接工具
const mongoose = require("mongoose");
// 数据库表对象集合（表设计信息）
const Article = require("./article");
const User = require("./user");
// 信息验证
const { validationResult } = require("express-validator");
// 加密工具
const bcrypt = require("bcryptjs");
const config = require("../utils/config");
const passport = require("passport");

const getBody = function (req, callback) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    callback(querystring.parse(body));
  });
};

function errorHandle(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Index");
  }
}

function authenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect();
  }
}

// 连接数据库
mongoose.connect(config.database);
const db = mongoose.connection;

// 配置数据库事件回调
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connection");
});

// 首页，查询并展示信息列表
module.exports.index = function (req, res) {
  // res.sendFile(path.join(__dirname, "../", "pages", "index.html"), errorHandle);
  Article.find({}, (err, articles) => {
    if (err) return console.log(err);

    res.render("index", {
      title: "新闻列表",
      articles,
    });
  });
};

// 信息新增界面
module.exports.submit = function (req, res) {
  // res.sendFile(path.join(__dirname, "../", "pages", "form.html"), errorHandle);

  res.render("form", {
    title: "新闻编辑",
  });
};

// 信息编辑界面，先按ID查找，再提交
module.exports.form = function (req, res) {
  Article.findById(req.params.id, (err, article) => {
    if (err) return console.log(err);

    res.render("edit", {
      title: "文章编辑",
      article,
    });
  });
};

// 提交信息接口
module.exports.edit = function (req, res) {
  const { title, author, body } = req.body;
  let article = {
    title,
    author,
    body,
  };

  const id = { _id: req.params.id };
  Article.update(id, article, (err) => {
    if (err) return console.log(err);

    req.flash("success", "Edited successful");
    res.redirect("/");
  });
};

// 删除信息接口
module.exports.delete = function (req, res) {
  let id = { _id: req.params.id };
  Article.remove(id, (err) => {
    if (err) return console.log(err);
    res.send('{code:200, message:"success"}');
  });
};

// 信息展示界面
module.exports.item = function (req, res) {
  Article.findById(req.params.id, (err, article) => {
    if (err) return console.log(err);
    User.findById(article.author, (err, user) => {
      article.author = user.username;
    });

    res.render("item", {
      title: article.title,
      article,
    });
  });
};

// 信息新增接口
module.exports.add = function (req, res) {
  // console.log(req.body.title);
  // getBody(req, (data) => {
  //   data.time = moment().format("Y-M-D H:mm:ss");
  //   file.write(path.join(__dirname, "../", "data", "news.json"), data, () => {
  //     res.end();
  //   });
  // });
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("form", {
      title: "新闻编辑",
      errors: errors.array(),
    });
    // return res.status(400).json({ errors: errors.array() });
  }

  let article = new Article();
  const { title, body } = req.body;

  article.title = title;
  article.author = req.user._id;
  article.body = body;

  article.save((err) => {
    if (err) return console.log(err);
    // 添加消息到消息队列，express-messages
    req.flash("success", "Added successful");
    res.redirect("/");
  });
};

// 注册接口，验证各个信息的有效性，加密密码保存到数据库
module.exports.register = function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("form", {
      title: "新闻编辑",
      errors: errors.array(),
    });
    // return res.status(400).json({ errors: errors.array() });
  }

  let user = new User();
  const { name, username, email, password } = req.body;

  user.name = name;
  user.username = username;
  user.email = email;
  user.password = password;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return console.log(err);

      user.password = hash;
      user.save((err) => {
        if (err) return console.log(err);
        // 添加消息到消息队列，express-messages
        req.flash("success", "Register successful, you can log in now");
        res.redirect("/login");
      });
    });
  });
};

// 校验账号密码信息，保持登录
module.exports.login = function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("form", {
      title: "新闻编辑",
      errors: errors.array(),
    });
    // return res.status(400).json({ errors: errors.array() });
  }

  let user = new User();
  const { username, password } = req.body;

  user.username = username;
  user.password = password;

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

// 退出登录
module.exports.logout = function (req, res, next) {
  req.logout();
  req.flash("success", "You can login again");
  res.redirect("/login");
};
