import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from './AuthLoadingScreen'
import AuthStackNavigator from './AuthStackNavigator'
import MainTabNavigator from './MainTabNavigator'


export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStackNavigator,
    Main : MainTabNavigator
  }, {
    initialRouteName: 'AuthLoading'
  })
);
