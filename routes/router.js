const components = require("../modules/handle.js");
// module.exports = function (req, res) {
//   if (req.method === "get" && /^\/(index)?$/.test(req.href)) {
//     components.index(req, res);
//   } else if (req.href === "/submit" && req.method === "get") {
//     components.submit(req, res);
//   } else if (req.href === "/add" && req.method === "post") {
//     components.add(req, res);
//   } else {
//     res.end("Not Found");
//   }
// };
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

router.get("*", (req, res, next) => {
  console.log("User: " + req.user);
  res.locals.user = req.user || null;
  next();
});

router.get(/^\/(index)?$/, components.index);

router.get("/submit", components.submit);

router.post(
  "/add",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    // body("author").not().isEmpty().withMessage("Author is required"),
    body("body").not().isEmpty().withMessage("Body is required"),
  ],
  components.add
);

router.get("/edit/:id", components.form);

router.post("/edit/:id", components.edit);

router.get("/item/:id", components.item);

router.delete("/delete/:id", components.delete);

module.exports = router;
