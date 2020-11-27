import Tasks from "./Tasks";
import { useState } from "react";

const app = {};
app.ALL_TODOS = "all";
app.ACTIVE_TODOS = "active";
app.COMPLETED_TODOS = "completed";

const ENTER_KEY = 13;

const Todo = ({ count }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editing, setEditing] = useState(null);
  const [nowShowing, setNowShowing] = useState(app.ALL_TODOS);

  const handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = newTodo.trim();

    if (val) {
      //add todo to list
      setTodos((prevTodos) => [
        ...prevTodos,
        { title: val, completed: false, id: new Date().getTime() },
      ]);
      setNewTodo("");
    }
  };
  const handleChange = (event) => {
    event.preventDefault();
    setNewTodo(event.target.value);
  };
  const toggle = (event, taskID) => {
    //event.preventDefault();
    let updatedTodos = [...todos];
    updatedTodos.map((todo) => {
      if (todo.id === taskID) {
        todo.completed = !todo.completed;
      }
    });
    setTodos(updatedTodos);
  };
  const destroy = (event, taskID) =>
    setTodos((todos) => todos.filter((todo) => todo.id !== taskID));
  const edit = (taskID) => {
    setEditing(taskID);
  };
  const save = (taskID, title) => {
    //save
    let updatedTodos = [...todos];
    updatedTodos.map((todo) => {
      if (todo.id === taskID) {
        todo.title = title;
      }
    });
    setTodos(updatedTodos);
    setEditing(null);
  };
  const cancel = () => setEditing(null);

  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onKeyDown={handleNewTodoKeyDown}
          onChange={handleChange}
          autoFocus={true}
        />
      </header>
      <section className="main">
        <ul className="todo-list">
          {todos.map((todo) => (
            <Tasks
              todo={todo}
              key={todo.id}
              onToggle={toggle}
              onDestroy={destroy}
              onEdit={edit}
              editing={editing === todo.id}
              onSave={save}
              onCancel={cancel}
            />
          ))}
        </ul>
      </section>
      <footer className="footer">
        <span className="todo-count">
          <strong>{count}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={nowShowing === app.ALL_TODOS ? "selected" : ""}
            >
              All
            </a>
          </li>{" "}
          <li>
            <a
              href="#/active"
              className={nowShowing === app.ACTIVE_TODOS ? "selected" : ""}
            >
              Active
            </a>
          </li>{" "}
          <li>
            <a
              href="#/completed"
              className={nowShowing === app.COMPLETED_TODOS ? "selected" : ""}
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
