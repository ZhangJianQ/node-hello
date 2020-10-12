const mongoose = require("mongoose");

let bookSchema = mongoose.Schema({
  name: {
    type: String,
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
