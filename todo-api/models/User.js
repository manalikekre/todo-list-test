const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: Schema.Types.String, index: true },
    email: { type: Schema.Types.String, index: true },
    password: { type: Schema.Types.String, index: true },
  },
  { autoCreate: true }
);

module.exports = mongoose.model("User", userSchema);
