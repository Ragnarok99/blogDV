const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  subTitle: String,
  body: String,
  postedAt: Date,
  author: String,
  categories: [String]
});

module.exports = mongoose.model("Post", postSchema);
