import { GET_PROFILE_FAIL, GET_PROFILE, CLEAR_PROFILE } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return { ...state, profile: payload, error: {}, loading: false };
    case GET_PROFILE_FAIL:
      return { ...state, error: payload, loading: false, profile: null };
    case CLEAR_PROFILE:
      return { ...state, profile: null, repos: [], loading: false };
    default:
      return { ...state };
  }
};
