const Subtask = require("../models/Subtask");

//get
exports.getSubtasks = async (req, res) => {
  Subtask.find({ taskID: req.params.taskID }, (err, subtasks) => {
    res.json({ subtasks });
  });
};

//post
exports.createSubtask = async (req, res) => {
  try {
    const subtask = new Subtask({
      title: req.body.title,
      taskID: req.params.taskID,
      completed: false,
    });
    const newSubtask = await subtask.save();
    res.send(newSubtask);
  } catch (error) {
    res.send({ error });
  }
};

//update
exports.updateSubtask = async (req, res) => {
  Subtask.findByIdAndUpdate(
    req.params.subtaskID,
    { title: req.body.title, completed: req.body.completed },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
        console.log("Data updated!");
      }
    }
  );
};

//delete
exports.deleteSubtask = async (req, res) => {
  Subtask.findByIdAndDelete(req.params.subtaskID, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
      console.log("Data Deleted!");
    }
  });
};
