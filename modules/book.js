const mongoose = require("mongoose");

let bookSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  cover: {
    type: String,
    require: false,
  },
  author: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  rank: {
    type: String,
    require: false,
  },
  brief: {
    type: String,
    require: false,
  },
  date: {
    type: Date,
    require: true,
  },
  page: {
    type: String,
    require: true,
  },
  download: {
    type: String,
    require: true,
  },
});

let Book = (module.exports = mongoose.model("Book", bookSchema));
