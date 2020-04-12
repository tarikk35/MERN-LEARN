import React, { Fragment, useEffect } from "react";
import Landing from "./components/layout/Landing";
import NavBar from "./components/layout/NavBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";
import Store from "./store";
import { Provider } from "react-redux";
import Alert from "./components/layout/Alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateProfile from "./components/ProfileForm/CreateProfile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import EditProfile from "./components/ProfileForm/EditProfile";
import AddExperience from "./components/ProfileForm/AddExperience";
import AddEducation from "./components/ProfileForm/AddEducation";
import Profiles from "./components/Profiles/Profiles";
import Profile from "./components/Profile/Profile";
import Posts from "./components/Posts/Posts";

if (localStorage.getItem("token")) setAuthToken(localStorage.getItem("token"));

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
  }, []);

  return (
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
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
