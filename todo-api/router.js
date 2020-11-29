const apiRouter = require("express").Router();
const taskController = require("./controllers/taskController");
const userController = require("./controllers/userController");
const subtaskController = require("./controllers/subtaskController");
const cors = require("cors");

apiRouter.use(cors());

apiRouter.get("/", (req, res) =>
  res.json(
    "Hello, if you see this message that means your backend is up and running successfully. Congrats!"
  )
);
apiRouter.get("/checkToken", userController.checkToken);
apiRouter.post("/registerUser", userController.createUser);
apiRouter.post("/login", userController.login);

apiRouter.post("/doesEmailExist", userController.doesEmailExist);
apiRouter.post("/doesUsernameExist", userController.doesUsernameExist);

apiRouter.get(
  "/tasks",
  userController.userMustBeLogedIn,
  taskController.getTasks
);
apiRouter.post(
  "/tasks",
  userController.userMustBeLogedIn,
  taskController.createTask
);
apiRouter.put(
  "/tasks/:taskID",
  userController.userMustBeLogedIn,
  taskController.updateTask
);
apiRouter.delete(
  "/tasks/:taskID",
  userController.userMustBeLogedIn,
  taskController.deleteTask
);

apiRouter.get(
  "/tasks/:taskID/subtasks",
  userController.userMustBeLogedIn,
  subtaskController.getSubtasks
);
apiRouter.post(
  "/tasks/:taskID/subtasks",
  userController.userMustBeLogedIn,
  subtaskController.createSubtask
);
apiRouter.put(
  "/tasks/:taskID/subtasks/:subtaskID",
  userController.userMustBeLogedIn,
  subtaskController.updateSubtask
);
apiRouter.delete(
  "/tasks/:taskID/subtasks/:subtaskID",
  userController.userMustBeLogedIn,
  subtaskController.deleteSubtask
);

module.exports = apiRouter;
