import Tasks from "./Tasks";
import Subtasks from "./Subtasks";
import React, { useReducer, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
const app = {};
app.ALL_TODOS = "all";
app.ACTIVE_TODOS = "active";
app.COMPLETED_TODOS = "completed";

const ENTER_KEY = 13;

const Todo = () => {
  const initialState = {
    tasks: [],
    newTask: "",
    editingTask: null,
    updatingTask: null,
    deletingTask: null,
    editingSubtask: { subtaskID: null, taskID: null },
    updatingSubtasks: null,
    deletingSubtask: null,
    newSubtask: "",
    nowShowing: app.ALL_TODOS,
  };

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function getTodos() {
      try {
        const response = await Axios.get("/tasks", {
          cancelToken: ourRequest.CancelToken,
        });
        if (response.data && response.data.tasks) {
          dispatch({ type: "setTasks", tasks: response.data.tasks });
        }
      } catch (e) {
        console.log("Error occurred - ", e);
      }
    }
    getTodos();
    return ourRequest.cancel();
  }, []);

  function reducer(state, action) {
    if (action.taskID) {
      var taskIndex = state.tasks.findIndex(
        (task) => task._id === action.taskID
      );
      var modifiedTasks = [...state.tasks];
    }
    switch (action.type) {
      case "setTasks":
        return {
          ...state,
          tasks: action.tasks,
        };
      case "addTask":
        return {
          ...state,
          tasks: [
            ...state.tasks,
            {
              title: action.title,
              completed: false,
              _id: action.taskID,
              subtasks: [],
            },
          ],
          newTask: "",
        };
      case "updateTaskStart":
        return { ...state, updatingTask: action.task };
      case "updateTaskComplete":
        let updatedTasks = [...state.tasks];
        updatedTasks.map((task) => {
          if (task._id === action.task.taskID) {
            task.title = action.task.title;
            task.completed = action.task.completed;
          }
        });
        return { ...state, tasks: updatedTasks, updatingTask: null };
      case "editTaskStart":
        return { ...state, editingTask: action.taskID };
      case "editTaskComplete":
        return { ...state, editingTask: null };
      case "deleteTaskStart":
        return { ...state, deletingTask: action.taskID };
      case "deleteTaskComplete":
        return {
          ...state,
          tasks: state.tasks.filter((task) => task._id !== action.taskID),
        };
      case "cancelTask":
        return { ...state, editingTask: null };

      case "changedTask":
        return { ...state, newTask: action.title };
      case "addSubtask":
        modifiedTasks[taskIndex].subtasks.map((subtask) => {
          if (subtask.isDummy) {
            delete subtask.isDummy;
            subtask.title = action.title;
            subtask._id = action.subtaskID;
          }
        });
        return {
          ...state,
          tasks: modifiedTasks,
          newSubtask: "",
        };
      case "updateSubtaskStart":
        return { ...state, updatingSubtask: action.subtask };
      case "updateSubtaskComplete":
        modifiedTasks[taskIndex].subtasks.map((subtask) => {
          if (subtask._id === action.subtask.subtaskID) {
            subtask.completed = action.subtask.completed;
            subtask.title = action.subtask.title;
          }
        });
        return { ...state, tasks: modifiedTasks, updatingSubtask: null };
      case "editSubtaskStart":
        return {
          ...state,
          editingSubtask: {
            subtaskID: action.subtaskID,
            taskID: action.taskID,
          },
        };
      case "editSubtaskComplete":
        return {
          ...state,
          editingSubtask: {
            subtaskID: null,
            taskID: null,
          },
        };
      case "deleteSubtaskStart":
        return {
          ...state,
          deletingSubtask: {
            subtaskID: action.subtaskID,
            taskID: action.taskID,
          },
        };
      case "deleteSubtaskComplete":
        modifiedTasks[taskIndex].subtasks = state.tasks[
          taskIndex
        ].subtasks.filter((subtask) => subtask._id !== action.subtaskID);
        return {
          ...state,
          tasks: modifiedTasks,
          deletingSubtask: null,
        };
      case "cancelSubtask":
        return { ...state, editingSubtask: { subtaskID: null, taskID: null } };
      case "changedSubtask":
        return { ...state, newSubtask: action.title };
      case "addDummySubtask":
        let editSubtask = new Date().getTime();
        modifiedTasks[taskIndex].subtasks = [
          ...state.tasks[taskIndex].subtasks,
          {
            title: "",
            completed: false,
            _id: editSubtask,
            taskID: action.taskID,
            isDummy: true,
          },
        ];
        return {
          ...state,
          tasks: modifiedTasks,
          editingSubtask: {
            subtaskID: editSubtask,
            taskID: action.taskID,
          },
        };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.updatingTask) {
      let task = state.tasks.find(
        (task) => task._id === state.updatingTask.taskID
      );
      if (
        task.completed === state.updatingTask.completed &&
        task.title === state.updatingTask.title
      ) {
        return;
      }
      const ourRequest = Axios.CancelToken.source();
      async function updateTask() {
        try {
          const response = await Axios.put(
            `/tasks/${state.updatingTask.taskID}`,
            {
              title: state.updatingTask.title,
              completed: state.updatingTask.completed,
            },
            {
              cancelToken: ourRequest.CancelToken,
            }
          );
          if (response && response.data) {
            dispatch({ type: "editTaskComplete" });
            dispatch({ type: "updateTaskComplete", task: state.updatingTask });
          }
        } catch (e) {
          console.log("Error occurred - ", e);
        }
      }
      updateTask();
      return ourRequest.cancel();
    }
  }, [state.updatingTask]);

  useEffect(() => {
    if (state.deletingTask) {
      const ourRequest = Axios.CancelToken.source();
      async function deleteTask() {
        const response = await Axios.delete(`/tasks/${state.deletingTask}`, {
          cancelToken: ourRequest.CancelToken,
        });
        if (response && response.data) {
          dispatch({
            type: "deleteTaskComplete",
            taskID: state.deletingTask,
          });
        }
      }
      deleteTask();
    }
  }, [state.deletingTask]);

  useEffect(() => {
    if (state.deletingSubtask) {
      let task = state.tasks.find(
        (task) => task._id === state.deletingSubtask.taskID
      );
      let prevSubtask = task.subtasks.find(
        (subtask) => subtask._id === state.deletingSubtask.subtaskID
      );
      if (prevSubtask.isDummy) {
        //dummy data remove
        dispatch({
          type: "deleteSubtaskComplete",
          taskID: state.deletingSubtask.taskID,
          subtaskID: state.deletingSubtask.subtaskID,
        });
        return;
      }
      const ourRequest = Axios.CancelToken.source();
      async function deleteSubtask() {
        const response = await Axios.delete(
          `/tasks/${state.deletingSubtask.taskID}/subtasks/${state.deletingSubtask.subtaskID}`,
          {
            cancelToken: ourRequest.CancelToken,
          }
        );
        if (response && response.data) {
          dispatch({
            type: "deleteSubtaskComplete",
            taskID: state.deletingSubtask.taskID,
            subtaskID: state.deletingSubtask.subtaskID,
          });
        }
      }
      deleteSubtask();
    }
  }, [state.deletingSubtask]);

  useEffect(() => {
    if (state.updatingSubtask) {
      let task = state.tasks.find(
        (task) => task._id === state.updatingSubtask.taskID
      );
      let prevSubtask = task.subtasks.find(
        (subtask) => subtask._id === state.updatingSubtask.subtaskID
      );
      if (
        prevSubtask.completed === state.updatingSubtask.completed &&
        prevSubtask.title === state.updatingSubtask.title
      ) {
        return;
      }
      if (prevSubtask.isDummy) {
        //post subtask
        //modify in state, remove isDummy
        addSubtask(
          {
            title: state.updatingSubtask.title,
            completed: state.updatingSubtask.completed,
          },
          state.updatingSubtask.taskID
        );
        return;
      }
      const ourRequest = Axios.CancelToken.source();
      async function updateTask() {
        try {
          const response = await Axios.put(
            `/tasks/${state.updatingSubtask.taskID}/subtasks/${state.updatingSubtask.subtaskID}`,
            {
              title: state.updatingSubtask.title,
              completed: state.updatingSubtask.completed,
            },
            {
              cancelToken: ourRequest.CancelToken,
            }
          );
          if (response && response.data) {
            dispatch({ type: "editSubtaskComplete" });
            dispatch({
              type: "updateSubtaskComplete",
              subtask: state.updatingSubtask,
              taskID: state.updatingSubtask.taskID,
            });
          }
        } catch (e) {
          console.log("Error occurred - ", e);
        }
      }
      updateTask();
      return ourRequest.cancel();
    }
  }, [state.updatingSubtask]);

  const addSubtask = async (payload, taskID) => {
    const response = await Axios.post(`tasks/${taskID}/subtasks`, payload);
    if (response && response.data)
      dispatch({
        type: "addSubtask",
        title: payload.title,
        subtaskID: response.data._id,
        taskID,
      });
  };

  const handleNewTodoKeyDown = async (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    var val = state.newTask.trim();
    if (val) {
      const response = await Axios.post("/tasks", {
        title: val,
      });
      if (response && response.data)
        dispatch({ type: "addTask", title: val, taskID: response.data._id });
      //add todo to list
    }
  };
  const handleChange = (event) => {
    event.preventDefault();
    dispatch({ type: "changedTask", title: event.target.value });
  };

  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={state.newTask}
          onKeyDown={handleNewTodoKeyDown}
          onChange={handleChange}
          autoFocus={true}
        />
      </header>
      <section className="main">
        <ul className="todo-list">
          {state.tasks.map((todo) => (
            <React.Fragment key={todo._id}>
              <Tasks
                todo={todo}
                key={todo._id}
                onToggle={() =>
                  dispatch({
                    type: "updateTaskStart",
                    task: {
                      taskID: todo._id,
                      title: todo.title,
                      completed: !todo.completed,
                    },
                  })
                }
                onDestroy={() =>
                  dispatch({ type: "deleteTaskStart", taskID: todo._id })
                }
                onEdit={() =>
                  dispatch({ type: "editTaskStart", taskID: todo._id })
                }
                editing={state.editingTask === todo._id}
                onSave={(title) =>
                  dispatch({
                    type: "updateTaskStart",
                    task: {
                      taskID: todo._id,
                      title,
                      completed: todo.completed,
                    },
                  })
                }
                onCancel={() => dispatch({ type: "cancelTask" })}
                addDummySubtask={() =>
                  dispatch({ type: "addDummySubtask", taskID: todo._id })
                }
              />
              <DispatchContext.Provider value={dispatch}>
                <Subtasks
                  subtasks={todo.subtasks}
                  editingSubtask={state.editingSubtask}
                />
              </DispatchContext.Provider>
            </React.Fragment>
          ))}
        </ul>
      </section>
      <footer className="footer">
        <span className="todo-count">
          <strong>{state.tasks.length}</strong> items left
        </span>
        {/* <ul className="filters">
          <li>
            <a
              href="#/"
              className={state.nowShowing === app.ALL_TODOS ? "selected" : ""}
            >
              All
            </a>
          </li>{" "}
          <li>
            <a
              href="#/active"
              className={
                state.nowShowing === app.ACTIVE_TODOS ? "selected" : ""
              }
            >
              Active
            </a>
          </li>{" "}
          <li>
            <a
              href="#/completed"
              className={
                state.nowShowing === app.COMPLETED_TODOS ? "selected" : ""
              }
            >
              Completed
            </a>
          </li>
        </ul> */}
        {/* {clearButton} */}
      </footer>
    </>
  );
};

export default Todo;
