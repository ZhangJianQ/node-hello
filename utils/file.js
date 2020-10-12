const fs = require("fs");
const readData = function (filename, callback) {
  fs.readFile(filename, (err, data) => {
    if (err) return false;

    // 解析Buffer对象到JS对象
    const rows = JSON.parse(data.toString("utf-8") || "[]");
    callback(rows);
  });
};

module.exports.read = function (filename, callback) {
  fs.readFile(filename, (err, data) => {
    if (err) return false;

    callback(data);
  });
};

module.exports.write = function (filename, data, callback) {};
