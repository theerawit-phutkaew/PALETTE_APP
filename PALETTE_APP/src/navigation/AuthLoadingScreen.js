import React, { Component } from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from '../types'
import { getUserData, logoutUser } from '../actions/userActions'
import configureStore from '../configureStore'
import { Provider } from 'react-redux'

import {
    Text,
    View,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage
} from 'react-native'

axios.defaults.baseURL = 'https://us-central1-palette-7bebb.cloudfunctions.net/api'


const store = configureStore;


export class AuthLoadingScreen extends Component {

    componentDidMount() {
        
        this._loadAsync()
    }
    _loadAsync = async () => {
        const userToken = await AsyncStorage.getItem('FBIdToken')
        if (userToken) {
            const decodedToken = jwtDecode(userToken);
            if (decodedToken.exp * 1000000 < Date.now()) {
                store.dispatch({ type: SET_UNAUTHENTICATED});
                store.dispatch(logoutUser());
            } else {
                store.dispatch({ type: SET_AUTHENTICATED });
                axios.defaults.headers.common['Authorization'] = userToken;
                store.dispatch(getUserData());
            }
        }
        this.props.navigation.navigate(userToken ? 'Main' : 'Auth')
    }

    render() {
        return (
            <Provider store={store} >
                 <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
            </Provider>
           
        )
    }

}

export default AuthLoadingScreen
