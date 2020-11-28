import "./App.css";
import Todo from "./components/Todo";
import { useState, useEffect } from "react";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";
function App() {
  return (
    <div className="App">
      <section className="todoapp">
        <Todo />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="http://github.com/petehunt/">petehunt</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
