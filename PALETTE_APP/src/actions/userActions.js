import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  SET_BLOG_USER,
  STOP_LOADING_UI
} from '../types';
import axios from 'axios';
import { AsyncStorage } from 'react-native';


export const loginUser = (userData, navigation) => (dispatch) => {
  dispatch({ type: LOADING_UI })
  axios
    .post('/login', userData)
    .then((res) => {
      console.log(res.data)
      setAuthorizationHeader(res.data.token)
      dispatch(getUserData())
      dispatch({ type: CLEAR_ERRORS })
      navigation.navigate('Main')
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    }
    )
};

export const signupUser = (newUserData, navigation) => (dispatch) => {
  dispatch({ type: LOADING_UI })
  axios
    .post('/signup', newUserData)
    .then((res) => {
      console.log(res.data)
      setAuthorizationHeader(res.data.token)
      dispatch(getUserData())
      dispatch({ type: CLEAR_ERRORS })
      navigation.navigate('Main')
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    }
    )
};

export const logoutUser = () => (dispatch) => {
  AsyncStorage.removeItem('FBIdToken')
  delete axios.defaults.headers.common['Authorization']
  dispatch({ type: SET_UNAUTHENTICATED })
}


export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER })
  axios
    .get('/user')
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data
      })
    })
    .catch((err) => console.log(err))
}




export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user/profile', formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};



export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user', userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios
    .post('/notifications', notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ
      });
    })
    .catch((err) => console.log(err));
};


const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`
  AsyncStorage.setItem('FBIdToken', FBIdToken)
  axios.defaults.headers.common['Authorization'] = FBIdToken
}


export const getBlogUser = (blogId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
      .get(`/blog/${blogId}`)
      .then((res) => {
          dispatch({
              type: SET_BLOG_USER,
              payload: res.data
          });
          dispatch({ type: STOP_LOADING_UI });
      })
      .catch((err) => console.log(err));
};

