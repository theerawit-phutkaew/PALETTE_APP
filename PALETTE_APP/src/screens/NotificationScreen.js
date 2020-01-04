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
    Image
} from 'react-native'

import { Footer } from 'native-base'
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { connect } from 'react-redux'
//import { getBlog, clearErrors } from '../../actions/dataActions'

import { withNavigation } from 'react-navigation'

import Notifications from '../components/user/Notifications'


export class NotificationScreen extends Component {



    componentDidMount() {

    }


    render() {
        const notifications = this.props.notifications
        return (
            <View style={styles.container}>
                <StatusBar />
                <View style={styles.header}>
                        <Text style={{ fontWeight: '300', fontSize: 18, marginLeft: 10 }}>Activity</Text>
                    </View>
                <ScrollView style={styles.notification}>
                    <Notifications notifications={notifications} />
                </ScrollView>

            </View>
        )
    }
}

Notifications.propTypes = {
    notifications: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    notifications: state.user.notifications
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notification: {
        paddingHorizontal: 10
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 12,
        //  borderBottomColor: 'gray',
        // borderBottomWidth: 1,
        marginTop: Constants.statusBarHeight
    },

})


export default connect(mapStateToProps)(NotificationScreen);
