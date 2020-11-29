import Todo from "./Todo";
import { useContext } from "react";
import UserContext from "../UserContext";
const Home = () => {
  const appDispatch = useContext(UserContext);
  function handleLogout() {
    appDispatch({
      type: "loggedOut",
    });
    appDispatch({
      type: "addFlashMessage",
      message: "You have successfully logged out.",
    });
  }
  return (
    <>
      {/* <header className="header"> */}
      <div className="logout-section">
        <span>{`Welcome, ${localStorage.getItem("todoUsername")}!`}</span>
        <button onClick={handleLogout} className="btn btn-sm btn-secondary">
          Sign Out
        </button>
      </div>
      {/* </header> */}

      <section className="todoapp">
        <Todo />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Inspired by <a href="http://github.com/petehunt/">petehunt</a>
        </p>
      </footer>
    </>
  );
};

export default Home;
