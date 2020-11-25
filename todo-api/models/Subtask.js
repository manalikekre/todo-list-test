const mongoose = require("mongoose");
const { Schema } = mongoose;

const subtaskSchema = new Schema(
  {
    taskID: { type: Schema.Types.ObjectId, index: true, ref: "Task" },
    title: String,
    completed: Boolean,
  },
  { autoCreate: true }
);

module.exports = mongoose.model("subtask", subtaskSchema);
