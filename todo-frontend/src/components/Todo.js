import Tasks from "./Tasks";
import Subtasks from "./Subtasks";
import React, { useReducer } from "react";
import DispatchContext from "../DispatchContext";

const app = {};
app.ALL_TODOS = "all";
app.ACTIVE_TODOS = "active";
app.COMPLETED_TODOS = "completed";

const ENTER_KEY = 13;

const Todo = () => {
  const initialState = {
    tasks: [
      //   {
      //     id: 1,
      //     title: "Groceries",
      //     completed: false,
      //     subtasks: [
      //       {
      //         title: "Apple",
      //         completed: false,
      //         id: 2,
      //         taskID: 1,
      //       },
      //       {
      //         title: "Rice",
      //         completed: false,
      //         id: 3,
      //         taskID: 1,
      //       },
      //     ],
      //   },
      //   {
      //     id: 4,
      //     title: "Learn",
      //     completed: false,
      //     subtasks: [],
      //   },
    ],
    newTask: "",
    editingTask: null,
    toggling: false,
    editingSubtask: { subtaskID: null, taskID: null },
    newSubtask: "",
    nowShowing: app.ALL_TODOS,
  };
  function reducer(state, action) {
    if (action.taskID) {
      var taskIndex = state.tasks.findIndex(
        (task) => task.id === action.taskID
      );
      var modifiedTasks = [...state.tasks];
    }
    switch (action.type) {
      case "addTask":
        return {
          ...state,
          tasks: [
            ...state.tasks,
            {
              title: action.title,
              completed: false,
              id: new Date().getTime(),
              subtasks: [],
            },
          ],
          newTask: "",
        };
      case "toggleTask":
        let copyTasks = [...state.tasks];
        copyTasks.map((task) => {
          if (task.id === action.taskID) {
            task.completed = !task.completed;
          }
        });
        return { ...state, tasks: copyTasks, toggling: !state.toggling };
      case "updateTask":
        let updatedTasks = [...state.tasks];
        updatedTasks.map((task) => {
          if (task.id === action.taskID) {
            task.title = action.title;
          }
        });
        return { ...state, tasks: updatedTasks, editingTask: null };
      case "deleteTask":
        return {
          ...state,
          tasks: state.tasks.filter((task) => task.id !== action.taskID),
        };
      case "cancelTask":
        return { ...state, editingTask: null };
      case "editTask":
        return { ...state, editingTask: action.taskID };
      case "changedTask":
        return { ...state, newTask: action.title };
      case "addSubtask":
        modifiedTasks[taskIndex].subtasks = [
          ...state.tasks[taskIndex].subtasks,
          {
            title: action.title,
            completed: false,
            id: new Date().getTime(),
            taskID: action.taskID,
          },
        ];
        return {
          ...state,
          tasks: modifiedTasks,
          newSubtask: "",
        };
      case "toggleSubtask":
        modifiedTasks[taskIndex].subtasks.map((subtask) => {
          if (subtask.id === action.subtaskID) {
            subtask.completed = !subtask.completed;
          }
        });
        return {
          ...state,
          tasks: modifiedTasks,
          toggling: !state.toggling,
        };
      case "updateSubtask":
        modifiedTasks[taskIndex].subtasks.map((subtask) => {
          if (subtask.id === action.subtaskID) {
            subtask.title = action.title;
          }
        });
        return {
          ...state,
          tasks: modifiedTasks,
          editingSubtask: { subtaskID: null, taskID: null },
        };
      case "deleteSubtask":
        modifiedTasks[taskIndex].subtasks = state.tasks[
          taskIndex
        ].subtasks.filter((subtask) => subtask.id !== action.subtaskID);
        return {
          ...state,
          tasks: modifiedTasks,
          toggling: !state.toggling,
        };
      case "cancelSubtask":
        return { ...state, editingSubtask: { subtaskID: null, taskID: null } };
      case "editSubtask":
        return {
          ...state,
          editingSubtask: {
            subtaskID: action.subtaskID,
            taskID: action.taskID,
          },
        };
      case "changedTask":
        return { ...state, newSubtask: action.title };
      case "addDummySubtask":
        let editSubtask = new Date().getTime();
        modifiedTasks[taskIndex].subtasks = [
          ...state.tasks[taskIndex].subtasks,
          {
            title: "",
            completed: false,
            id: editSubtask,
            taskID: action.taskID,
          },
        ];
        return {
          ...state,
          tasks: modifiedTasks,
          editingSubtask: {
            subtaskID: editSubtask,
            taskID: action.taskID,
          },
          toggling: !state.toggling,
        };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    var val = state.newTask.trim();
    if (val) {
      dispatch({ type: "addTask", title: val });
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
            <React.Fragment key={todo.id}>
              <Tasks
                todo={todo}
                key={todo.id}
                onToggle={() =>
                  dispatch({ type: "toggleTask", taskID: todo.id })
                }
                onDestroy={() =>
                  dispatch({ type: "deleteTask", taskID: todo.id })
                }
                onEdit={() => dispatch({ type: "editTask", taskID: todo.id })}
                editing={state.editingTask === todo.id}
                onSave={(title) =>
                  dispatch({ type: "updateTask", taskID: todo.id, title })
                }
                onCancel={() => dispatch({ type: "cancelTask" })}
                addDummySubtask={() =>
                  dispatch({ type: "addDummySubtask", taskID: todo.id })
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
        <ul className="filters">
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
        </ul>
        {/* {clearButton} */}
      </footer>
    </>
  );
};

export default Todo;
