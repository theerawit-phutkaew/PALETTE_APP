import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator

} from 'react-native'
import { Button } from 'react-native-elements';
import Constants from 'expo-constants';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import axios from 'axios';
import { Ionicons, } from '@expo/vector-icons';

//component
import StaticUserBlogs from '../../components/user/StaticUserBlogs'
import StaticProfile from '../../components/user/StaticProfile'
import EditDetails from '../../components/user/EditDetails'

class UserScreen extends Component {

    render() {
        const { loading, authenticated, credentials, authUserBlogs } = this.props.user
        const userBlogsMarkup = loading ? null : !authenticated ? null : authUserBlogs[0] === undefined ? (
            <View style={styles.container}>
                <View style={styles.noUserBlogs}>
                    <Text style={{ fontSize: 18, fontWeight: '300', color: 'gray' }}>You have no Blog</Text>
                </View>
            </View>
        ) : (
                <StaticUserBlogs userblogs={authUserBlogs} navigate={this.props.navigation.navigate} destination='Posts' />
            )
        return (
            <View style={styles.container}>
                {
                    !this.props.user.loading ? (authenticated ? (
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.header}>
                                <Text style={{ fontSize: 18, fontWeight: '300' }}>{credentials.handle}</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingModal')}>
                                    <Ionicons name={'ios-settings'} size={25} />
                                </TouchableOpacity>
                            </View>
                            <StaticProfile profile={credentials} />
                        </View>
                    ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Button
                                    title='LOGIN'
                                    type='solid'
                                    titleStyle={{ color: 'white' }}
                                    buttonStyle={{ backgroundColor: '#E13C3F', width: 250 }}
                                    onPress={() => this.props.navigation.navigate('Login')}

                                />
                            </View>
                        )) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                <ActivityIndicator />
                            </View>
                        )
                }
                {userBlogsMarkup}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingVertical: 12,
        marginTop: Constants.statusBarHeight,
    },
    noUserBlogs: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center'
    }
})


UserScreen.propTypes = {
    user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});


export default connect(mapStateToProps)(UserScreen)
