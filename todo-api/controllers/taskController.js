const Task = require("../models/Task");
const Subtask = require("../models/Subtask");
var ObjectId = require("mongoose").Types.ObjectId;
//get
exports.getTasks = async (req, res) => {
  //   Task.find({ userID: "5fbba9ae3faf8939d0f066fc" }, (err, tasks) => {
  //     res.json({ tasks });
  //   });

  Task.aggregate(
    [
      {
        $match: {
          userID: new ObjectId("5fbba9ae3faf8939d0f066fc"),
        },
      },
      {
        $lookup: {
          from: "subtasks",
          localField: "_id",
          foreignField: "taskID",
          as: "subtasks",
        },
      },
    ],
    (err, tasks) => {
      res.json({ tasks });
    }
  );
};

//post
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      userID: "5fbbb4d8ccc09622646fd0ff",
      completed: false,
    });
    const newTask = await task.save();
    res.send(newTask);
  } catch (error) {
    res.send({ error });
  }
};

//update
exports.updateTask = async (req, res) => {
  Task.findByIdAndUpdate(
    req.params.taskID,
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
exports.deleteTask = async (req, res) => {
  Task.findByIdAndDelete(req.params.taskID, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
      console.log("Data Deleted!");
    }
  });
};
