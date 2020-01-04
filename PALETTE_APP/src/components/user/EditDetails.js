import React, { Component } from 'react'
import { View } from 'react-native'
import { Button, Text, Input } from 'react-native-elements';
import PropTypes from 'prop-types';

import Constants from 'expo-constants';
import { connect } from 'react-redux'
import { editUserDetails } from '../../actions/userActions';

import { Ionicons, } from '@expo/vector-icons';

class EditDetails extends Component {
    state = {
        bio: '',
        open: false
    }

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : ''
        })
    }

    handleOpen = () => {
        this.setState({ open: true })
        this.mapUserDetailsToState(this.props.credentials)
    }
    handleClose = () => {
        this.setState({ open: false })
    }

    componentDidMount() {
        const { credentials } = this.props
        this.mapUserDetailsToState(credentials)
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio
        }
        this.props.editUserDetails(userDetails)
        this.handleClose()
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>edit</Text>
            </View>
        )
    }
}

EditDetails.prototype = {
    editUserDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

export default connect(mapStateToProps, { editUserDetails })(EditDetails) 
