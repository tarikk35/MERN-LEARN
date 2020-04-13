import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  REMOVE_COMMENT,
  ADD_COMMENT
} from "./types";

export const getPosts = () => async dispatch => {
  try {
    const response = await axios.get("/api/posts");
    dispatch({ type: GET_POSTS, payload: response.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const like = postId => async dispatch => {
  try {
    const response = await axios.put(`/api/posts/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: response.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: postId
    });
    dispatch(setAlert("Post has been removed.", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addPost = formData => async dispatch => {
  try {
    const config = { "Content-Type": "application/json" };
    const response = await axios.post("/api/posts", formData, config);
    dispatch({
      type: ADD_POST,
      payload: response.data
    });
    dispatch(setAlert("Post created.", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getPost = postId => async dispatch => {
  try {
    const response = await axios.get(`/api/posts/${postId}`);
    dispatch({
      type: GET_POST,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addComment = (postId, comment) => async dispatch => {
  const config = { "Content-Type": "application/json" };
  try {
    const response = await axios.post(
      `/api/posts/comment/${postId}`,
      comment,
      config
    );
    dispatch({
      type: ADD_COMMENT,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeComment = (postId, commentId) => async dispatch => {
  try {
    const response = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: response.data
    });
    dispatch(setAlert("Comment is removed.", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
