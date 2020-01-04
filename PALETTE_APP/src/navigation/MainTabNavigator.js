import React, { Component } from 'react'
import { createStackNavigator, Header } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Ionicons } from '@expo/vector-icons';

//home stack
import HomeScreen from '../screens/homestack/HomeScreen';
import BlogDetail from '../screens/homestack/BlogDetail';
import UserDetail from '../screens/homestack/UserDetail';
import UserPost from '../screens/homestack/UserPosts'
import CommentScreen from '../screens/homestack/CommentScreen'


//user stack
import UserScreen from '../screens/userstack/UserScreen';
import SettingScreen from '../screens/userstack/SettingScreen';
import Posts from '../screens/userstack/Posts'


import SearchScreen from '../screens/SearchScreen';
import AddContentScreen from '../screens/AddContentScreen';
import NotificationScreen from '../screens/NotificationScreen';


const Homestack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    path: '/blogs',
    navigationOptions: {
      header: null,
    }
  },
  BlogDetail: {
    screen: BlogDetail,
    path: '/blog/:blogId',
    navigationOptions: {
      header: null,
    }
  },
  UserDetail: {
    screen: UserDetail,
    path: '/user/:handle',
    navigationOptions: {
      header: null,
    }
  },
  UserPost: {
    screen: UserPost,
    path: '/user/:handle/post',
    navigationOptions: {
      header: null,
    }
  },

})

const ProfileStack = createStackNavigator({
  Profile: {
    screen: UserScreen,
    path: '/user',
    navigationOptions: {
      header: null,
    }
  },

  Posts: {
    screen: Posts,
    path: '/user/posts',
    navigationOptions: {
      header: null,
    }
  }
})




const tabNavigator = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Homestack,
        AddContent: {
          screen: AddContentScreen,
        },
        Notification: {
          screen: NotificationScreen,
        },
        ProfileStack
      },
      {
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarOnPress: ({ defaultHandler }) => {
            if (navigation.state.key === 'AddContent') {
              navigation.navigate('AddContentModel');
            } else {
              defaultHandler();
            }

          },
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Homestack') {
              iconName = 'md-home';

            } else if (routeName === 'Search') {
              iconName = 'ios-search';

            } else if (routeName === 'AddContent') {
              iconName = 'md-add';

            } else if (routeName === 'Notification') {
              iconName = 'md-heart';

            } else if (routeName === 'ProfileStack') {
              iconName = 'md-person';
            }
            return <Ionicons name={iconName} size={29} color={tintColor} />;
          },
        }),
        tabBarOptions: {
          activeTintColor: '#ff4a00',
          inactiveTintColor: 'gray',
          showLabel: false,
          style: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            shadowOffset: { width: 3, height: 5 },
            shadowColor: '#016864',
            shadowOpacity: 1,
          },
        },
      }
    ),
    AddContentModel: {
      screen: AddContentScreen
    },
    SettingModal: {
      screen: SettingScreen
    },
    CommentModel: {
      screen: CommentScreen
    }
  },
  {
    mode: 'model',
    headerMode: 'none'
  }
)



export default tabNavigator

