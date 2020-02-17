const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  password: { type: String, required: true },
  category: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  artisicName: { type: String, required: true },
  followers: { count: Number, list: Array },
  followings: { count: Number, list: Array },
  productsCount: { type: Number, require: true }

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
