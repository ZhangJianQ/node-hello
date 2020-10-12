const express = require("express");
const router = express.Router();
const components = require("../modules/handle.js");
const { body } = require("express-validator");

router.get("/login", (req, res) => {
  res.render("login", {
    title: "登录",
  });
});

router.post("/login", components.login);

router.get("/register", (req, res) => {
  res.render("register", {
    title: "账号注册",
  });
});

router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("username").not().isEmpty().withMessage("Username is required"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  components.register
);

router.get("/logout", components.logout);

module.exports = router;
