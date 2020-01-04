import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import axios from 'axios'
import join from 'url-join'
import { isConfigurationAvailable } from 'expo/build/AR'

axios.interceptors.request.user(async (config) => {
    const jwtToken = await AsyncStorage.getItem('token')
    if (jwtToken != null) {
        config.headers = {
            'Authorization': jwtToken,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        }
    }
    config.url = join('https://us-central1-palette-7bebb.cloudfunctions.net/api', config.url)
    return config
})

export const httpClient = axios