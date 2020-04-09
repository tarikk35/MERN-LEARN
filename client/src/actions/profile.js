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
