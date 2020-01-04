import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, } from 'react-native'
import { Button, Text, Input } from 'react-native-elements';
import PropTypes from 'prop-types';

import Image from 'react-native-scalable-image'
import Constants from 'expo-constants';
import { connect } from 'react-redux'
import { editUserDetails,logoutUser } from '../../actions/userActions';

import { Ionicons, } from '@expo/vector-icons';

import ProfileUpload from '../../components/user/ProfileUpload'


class SettingScreen extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
    }

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : '',
        })
    }

    componentWillMount() {
        this.mapUserDetailsToState(this.props.credentials)
    }

    handleClose = () => {
        this.props.navigation.goBack()
    }

    componentDidMount() {
        const { credentials } = this.props
        this.mapUserDetailsToState(credentials)
    }


    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        }
        this.props.editUserDetails(userDetails)
        this.handleClose()
    }

    handleLogout = () => {
        this.props.logoutUser()
        this.props.navigation.navigate('Login')
    }


    render() {
        const { credentials } = this.props
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Ionicons name='md-close' size={28} color='gray' />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: '300' }}>Edit Profile</Text>
                    </View>
                    <TouchableOpacity onPress={this.handleSubmit} >
                        <Ionicons name='md-checkmark' size={28} color='#E13C3F' />
                    </TouchableOpacity>
                </View>

                <View style={styles.profile}>
                    <ProfileUpload />
                </View>

                <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                    <View style={{}}>
                        <Input
                            label='Bio'
                            name='bio'
                            labelStyle={{ color: 'gray' }}
                            inputContainerStyle={{ borderBottomColor: 'gray' }}
                            multiline
                            placeholder='A short bio about yourself'
                            onChangeText={(bio) => this.setState({ bio })}
                            value={this.state.bio}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            label='Website'
                            name='website'
                            labelStyle={{ color: 'gray' }}
                            inputContainerStyle={{ borderBottomColor: 'gray' }}
                            placeholder='Your personal/professinal website'
                            onChangeText={(website) => this.setState({ website })}
                            value={this.state.website}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            label='Location'
                            name='location'
                            labelStyle={{ color: 'gray' }}
                            inputContainerStyle={{ borderBottomColor: 'gray' }}
                            placeholder='Where you live'
                            onChangeText={(location) => this.setState({ location })}
                            value={this.state.location}
                        />
                    </View>
                    <View style={{marginTop:20}}>
                        <Button
                            title='LOGOUT'
                            type='solid'
                            titleStyle={{ color: 'white' }}
                            buttonStyle={{ backgroundColor: '#E13C3F', width: 250 }}
                            onPress={this.handleLogout}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

SettingScreen.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

const mapActionToProps = {
    logoutUser,
    editUserDetails
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#FAFAFA'
    },
    profile: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 10,
        alignItems: 'center'
    }

})

export default connect(mapStateToProps, mapActionToProps)(SettingScreen) 
