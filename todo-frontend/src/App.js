import React, { useState, useReducer, useEffect, Suspense } from "react";
import "./App.css";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import Registration from "./components/Registration";
import NotFound from "./components/NotFound";
import Axios from "axios";
import LoadingIcon from "./components/LoadingIcon";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserContext from "./UserContext";
Axios.defaults.baseURL = "http://localhost:8080";

function App() {
  Axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("todoToken");
    if (token) config.headers.Authorization = token;

    return config;
  });
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("todoToken")),
    user: {
      token: localStorage.getItem("todoToken"),
      username: localStorage.getItem("todoUsername"),
    },
    flashMessages: [],
  };
  function ourReducer(state, action) {
    switch (action.type) {
      case "loggedIn":
        return { ...state, loggedIn: true, user: action.data };
      case "loggedOut":
        return { ...state, loggedIn: false };
      case "addFlashMessage":
        return {
          ...state,
          flashMessages: [...state.flashMessages, action.message],
        };
    }
  }
  const [state, dispatch] = useReducer(ourReducer, initialState);
  useEffect(() => {
    if (state.loggedIn) {
      // Save to local storage
      localStorage.setItem("todoToken", state.user.token);
      localStorage.setItem("todoUsername", state.user.username);
    } else {
      // Save to local storage
      localStorage.removeItem("todoToken");
      localStorage.removeItem("todoUsername");
    }
  }, [state.loggedIn]);

  //check if token expired or not
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.get(
            "/checkToken",
            {
              headers: {
                Authorization: state.user.token,
              },
            },
            { cancelToken: ourRequest.CancelToken }
          );
          if (!response.data) {
            dispatch({ type: "loggedOut" });
            dispatch({
              type: "addFlashMessage",
              message: "Your session has expired. Please log in again.",
            });
          }
        } catch (e) {
          console.log("Error occurred - ", e);
        }
      }
      fetchResults();
      return ourRequest.cancel();
    }
  }, []);

  return (
    <div className="App">
      <div className="floating-alerts">
        {state.flashMessages.map((msg, index) => {
          return (
            <div
              key={index}
              className="alert alert-success test-cetner floating-alert shadow-sm"
            >
              {msg}
            </div>
          );
        })}
      </div>
      <UserContext.Provider value={dispatch}>
        <BrowserRouter>
          <Suspense fallback={<LoadingIcon />}>
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <LoginPage />}
              </Route>
              <Route path="/register">
                <Registration />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
