import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Text,
    StatusBar,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    ActivityIndicator,
    ImageEditor,
    Dimensions,
    Image,
    FlatList
} from 'react-native'

import { Footer } from 'native-base'
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { connect } from 'react-redux'
import { markNotificationsRead ,getUserData} from '../../actions/userActions'
import { getBlog } from '../../actions/dataActions'
import { withNavigation } from 'react-navigation'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


class Notifications extends Component {
    state = {
        loading: false
    }

    componentDidMount() {
        let unreadNotificationsIds = this.props.notifications
            .filter((not) => !not.read)
            .map((not) => not.notificationId)
        this.props.markNotificationsRead(unreadNotificationsIds)
    }

    handleClose = (not) => {
        this.props.navigation.navigate('BlogDetail', { blog: not })
        this.props.getBlog(not.blogId)
      //  this.props.getUserData()
    }

    render() {
        dayjs.extend(relativeTime)
        const notifications = this.props.notifications
        let notificationIcon
        let notificationsMarkup = notifications && notifications.length > 0 ? (
            notifications.map((not, index) => {
                const verb = not.type === 'like' ? 'liked' : 'commented on'
                const time = dayjs(not.createdAt).fromNow()
                const iconColor = not.read ? 'gray' : 'red'
                const icon = not.type === 'like' ? (
                    <Ionicons name='md-heart' size={30} color={iconColor} />
                ) : (
                        <Ionicons name='ios-chatboxes' size={30} color={iconColor} />
                    )
                return (
                    <TouchableOpacity onPress={() => this.handleClose(not)} key={index}>
                        <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems:'center' }} >
                            {icon}
                            <Text style={{ fontSize: 16, fontWeight: 'normal',marginLeft:10}}>{not.sender} {verb} your blog {time}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        ) : (
                <View style={styles.container}>
                    <Text>You have no notifications yet</Text>
                </View>
            )
        return notificationsMarkup
    }
}

Notifications.propTypes = {
    getBlog: PropTypes.func.isRequired,
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    getBlog,
    markNotificationsRead,
    getUserData
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})


export default connect(mapStateToProps, mapActionsToProps)(withNavigation(Notifications));
