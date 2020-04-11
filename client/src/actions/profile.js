import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILE_FAIL,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED
} from "../actions/types";

export const getMyProfile = () => async dispatch => {
  try {
    const response = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify(formData);

    const response = await axios.post("/api/profile", body, config);

    dispatch({
      type: GET_PROFILE,
      payload: response.data
    });

    dispatch(
      setAlert(`Profile has been ${edit ? "updated." : "created."}`, "success")
    );

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach(error => dispatch(setAlert(error.message, "danger")));
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify(formData);

    const response = await axios.put("/api/profile/experience", body, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Experience added.", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach(error => dispatch(setAlert(error.message, "danger")));
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify(formData);

    const response = await axios.put("/api/profile/education", body, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Education added.", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach(error => dispatch(setAlert(error.message, "danger")));
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteExperience = expId => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/experience/${expId}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Experience is deleted.", "success"));
  } catch (err) {
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteEducation = eduId => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/education/${eduId}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Education is deleted.", "success"));
  } catch (err) {
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteAccount = () => async dispatch => {
  if (
    window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    )
  ) {
    try {
      const response = await axios.delete("/api/profile");
      dispatch({
        type: CLEAR_PROFILE
      });

      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert("Your account has been permanently deleted."));
    } catch (err) {
      dispatch({
        type: GET_PROFILE_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
