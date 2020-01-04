import React, { Component } from 'react';
import AppNavigator from './src/navigation/AppNavigator'
import { Provider } from 'react-redux'
import configureStore from './src/configureStore'
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native'

const store = configureStore;

export default class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <AppNavigator />
      </Provider>
    );
  }
}



