const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, index: true, ref: "User" },
    title: String,
    completed: Boolean,
  },
  { autoCreate: true }
);

module.exports = mongoose.model("Task", taskSchema);
