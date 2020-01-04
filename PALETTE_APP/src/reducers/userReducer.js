import {
    SET_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LIKE_BLOG,
    UNLIKE_BLOG,
    MARK_NOTIFICATIONS_READ,
    SET_BLOG_USER

} from '../types'


const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
    authUserBlogs: [],
    authUserBlog: {},

};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            }
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            }
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case SET_BLOG_USER:
            return {
                ...state,
                authUserBlog: action.payload
            }
        case LIKE_BLOG:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        blogId: action.payload.blogId
                    }
                ]
            }
        case UNLIKE_BLOG:
            return {
                ...state,
                likes: state.likes.filter(
                    (like) => like.blogId !== action.payload.blogId
                )
            }
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach((not) => (not.read = true))
            return {
                ...state
            }
        default:
            return state;
    }
}