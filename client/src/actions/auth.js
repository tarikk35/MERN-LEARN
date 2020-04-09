import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR
} from "./types";
import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async dispatch => {
  if (localStorage.getItem("token")) {
    setAuthToken(localStorage.getItem("token"));
  }
  try {
    const response = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const register = ({ name, email, password }) => async dispatch => {
  try {
    const body = JSON.stringify({ name, email, password });
    const config = { headers: { "Content-Type": "application/json" } };

    const response = await axios.post("/api/users", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data
    });
  } catch (err) {
    console.log(err.response.data.errors);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};
