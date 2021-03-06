import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

export default (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(i => i.id !== payload);
    default:
      return state;
  }
};
