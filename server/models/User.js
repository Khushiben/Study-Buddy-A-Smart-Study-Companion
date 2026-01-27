const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetToken: String,        // <-- add this
  resetTokenExpiry: Date     // <-- add this
});

module.exports = mongoose.model("User", UserSchema);
