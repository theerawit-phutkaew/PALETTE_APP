import {
    SET_BLOGS,
    LOADING_DATA,
    LIKE_BLOG,
    UNLIKE_BLOG,
    DELETE_BLOG,
    SET_ERRORS,
    POST_BLOG,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_BLOG,
    STOP_LOADING_UI,
    SUBMIT_COMMENT,
    SET_USERBLOGS,
    STOP_LOADING_DATA
} from '../types';
import axios from 'axios';

// Get all blogs
export const getBlogs = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get('/blogs')
        .then((res) => {
            dispatch({
                type: SET_BLOGS,
                payload: res.data
            });
        //    dispatch({ type: STOP_LOADING_DATA });
        })
        .catch((err) => {
            dispatch({
                type: SET_BLOGS,
                payload: []
            });
        });
};




//Get one blog
export const getBlog = (blogId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .get(`/blog/${blogId}`)
        .then((res) => {
            dispatch({
                type: SET_BLOG,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch((err) => console.log(err));
};





// Post a blog
export const postBlog = (newBlog) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/blog', newBlog)
        .then((res) => {
            dispatch({
                type: POST_BLOG,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};
// Like a blog
export const likeBlog = (blogId) => (dispatch) => {
    axios
        .get(`/blog/${blogId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_BLOG,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
};
// Unlike a blog
export const unlikeBlog = (blogId) => (dispatch) => {
    axios
        .get(`/blog/${blogId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_BLOG,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
};
// Submit a comment
export const submitComment = (blogId, commentData) => (dispatch) => {
    axios
        .post(`/blog/${blogId}/comment`, commentData)
        .then((res) => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};
export const deleteBlog = (blogId) => (dispatch) => {
    axios
        .delete(`/blog/${blogId}`)
        .then(() => {
            dispatch({ type: DELETE_BLOG, payload: blogId });
        })
        .catch((err) => console.log(err));
};

export const getUserData = (handle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get(`/user/${handle}`)
        .then((res) => {
            dispatch({
                type: SET_USERBLOGS,
                payload: res.data.blogs
            });
        })
        .catch(() => {
            dispatch({
                type: SET_USERBLOGS,
                payload: null
            });
        });
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .post('/post', formData)
        .then(() => {
            dispatch(getBlogs());
        })
        .catch((err) => console.log(err));
};


/*
export const getUserBlogs = (handle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get(`/user/${handle}`)
        .then((res) => {
            dispatch({
                type: SET_USERBLOGS,
                payload: res.data.userBlogs
            });
        })
        .catch(() => {
            dispatch({
                type: SET_USERBLOGS,
                payload: null
            });
        });
};
*/

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

export const loadingData = () => (dispatch) => {
    dispatch({ type: LOADING_UI });
};