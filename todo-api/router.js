const apiRouter = require("express").Router();
const taskController = require("./controllers/taskController");
const userController = require("./controllers/userController");
const subtaskController = require("./controllers/subtaskController");
const cors = require("cors");

apiRouter.use(cors());

apiRouter.post("/registerUser", userController.createUser);
apiRouter.post("/login", userController.login);

apiRouter.get("/tasks", taskController.getTasks);
apiRouter.post("/tasks", taskController.createTask);
apiRouter.put("/tasks/:taskID", taskController.updateTask);
apiRouter.delete("/tasks/:taskID", taskController.deleteTask);

apiRouter.get("/tasks/:taskID/subtasks", subtaskController.getSubtasks);
apiRouter.post("/tasks/:taskID/subtasks", subtaskController.createSubtask);
apiRouter.put(
  "/tasks/:taskID/subtasks/:subtaskID",
  subtaskController.updateSubtask
);
apiRouter.delete(
  "/tasks/:taskID/subtasks/:subtaskID",
  subtaskController.deleteSubtask
);

module.exports = apiRouter;
