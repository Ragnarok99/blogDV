const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  username: String,
  createdAt: Date
});

module.exports = mongoose.model("User", userSchema);
