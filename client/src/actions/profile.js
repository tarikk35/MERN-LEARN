import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, GET_PROFILE_FAIL } from "../actions/types";

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

    dispatch(setAlert(`Profile has been ${edit ? "updated." : "created."}`,"success"));

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
