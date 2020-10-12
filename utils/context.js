const url = require("url");
module.exports = function (req, res) {
  req.method = req.method.toLowerCase();
  req.href = url.parse(req.url).href;
};
