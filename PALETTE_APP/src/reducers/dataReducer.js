import {
    SET_BLOGS,
    LIKE_BLOG,
    UNLIKE_BLOG,
    LOADING_DATA,
    DELETE_BLOG,
    POST_BLOG,
    SET_BLOG,
    SUBMIT_COMMENT,
    SET_USERBLOGS,
    STOP_LOADING_DATA
} from '../types';

const initialState = {
    userblogs: [],
    blogs: [],
    blog: {},
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case STOP_LOADING_DATA:
            return {
                ...state,
                loading: false
            }
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_BLOGS:
            return {
                ...state,
                blogs: action.payload,
               loading: false
            }
        case SET_BLOG:
            return {
                ...state,
                blog: action.payload
            }
        case SET_USERBLOGS:
            return {
                ...state,
                userblogs: action.payload,
                loading: false
            }
        case LIKE_BLOG:
        case UNLIKE_BLOG:
            let index = state.blogs.findIndex(
                (blog) => blog.blogId === action.payload.blogId
            )
            state.blogs[index] = action.payload;
            if (state.blog.blogId === action.payload.blogId) {
                state.blog = action.payload
            }
            return {
                ...state
            }
        case DELETE_BLOG:
            index = state.blogs.findIndex(
                (blog) => blog.blogId === action.payload.blogId
            )
            state.blogs.splice(index, 1)
            return {
                ...state,
            }
        case POST_BLOG:
            return {
                ...state,
                blogs: [action.payload, ...state.blogs]
            }
        case SUBMIT_COMMENT:
            return {
                ...state,
                blog: {
                    ...state.blog,
                    comments: [action.payload, ...state.blog.comments]
                }
            }
        default:
            return state;
    }
}
