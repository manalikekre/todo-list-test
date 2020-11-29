import Axios from "axios";
import { useState, useContext } from "react";
import UserContext from "../UserContext";
import { NavLink } from "react-router-dom";
const LoginPage = () => {
  const appDispatch = useContext(UserContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", {
        username,
        password,
      });
      console.log(response);
      if (response.data) {
        console.log("login successful");

        appDispatch({
          type: "loggedIn",
          data: response.data,
        });
        appDispatch({
          type: "addFlashMessage",
          message: "You have successfully logged in.",
        });
      } else {
        console.log("login failed");
        appDispatch({
          type: "addFlashMessage",
          message: "Invalid username / password",
        });
      }
    } catch (e) {
      console.log("there was a problem");
    }
  }
  return (
    <div className="login-page">
      <div className="login-header">
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input
              name="username"
              className="form-control form-control-sm input-dark"
              type="text"
              placeholder="Username"
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input
              name="password"
              className="form-control form-control-sm input-dark"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
          </div>
        </div>
      </form>
      <NavLink className="register-link" to={"/register"}>
        New User? Register
      </NavLink>
    </div>
  );
};

export default LoginPage;
