import React, { Fragment } from "react";
import Landing from "./components/layout/Landing";
import NavBar from "./components/layout/NavBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";
import Store from "./store";
import { Provider } from "react-redux";
import Alert from "./components/layout/Alert";

const App = () => (
  <Provider store={Store}>
    <Router>
      <Fragment>
        <NavBar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
