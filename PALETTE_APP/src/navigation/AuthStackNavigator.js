import React, { Component } from 'react'
import { Text, View } from 'react-native'

import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/authstack/LoginScreen';
import SignUpScreen from '../screens/authstack/SignUpScreen';



const AuthStackNavigator = createStackNavigator({
    Login : LoginScreen,
    SignUp : SignUpScreen
},{
    defaultNavigationOptions:{
        header:null
    }
})

export default AuthStackNavigator;