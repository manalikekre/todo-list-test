const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  { autoCreate: true }
);

module.exports = mongoose.model("User", userSchema);
