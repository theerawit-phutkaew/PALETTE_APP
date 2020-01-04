import {  createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import dataReducer from './reducers/dataReducer'
import uiReducer from './reducers/uiReducer'

const initialState = {};

const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer
})


const logger = store => next => action => {
    console.group(action.type)
    console.log('current state', store.getState())
    console.log('dispatching', action)
    const result = next(action)
    console.log('next state', store.getState())
    console.groupEnd(action.type)
    return result
  }


const middleware = [thunk];

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const configureStore = createStore(reducers, initialState, applyMiddleware(...middleware))
export default configureStore;