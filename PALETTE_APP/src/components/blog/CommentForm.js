import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native'
import { Input } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { submitComment } from '../../actions/dataActions'

export class CommentForm extends Component {
    state = {
        body: '',
        errors: {}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ body: '' });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.blogId, { body: this.state.body })
    }


    _maybeRenderUploadingOverlay = () => {
        if (this.state.body !== '') {
            return (
                <TouchableOpacity onPress={this.handleSubmit}>
                    <Ionicons name='md-send' size={26} color='#E13C3F' />
                </TouchableOpacity>
            );
        } else {
            return null
        }
    };

    render() {
        const { authenticated, credentials: { profileUrl } } = this.props.user
        const errors = this.state.errors

        const commentFormMarkup = authenticated ? (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: profileUrl }}
                        style={{ width: 45, height: 45, borderRadius: 75 }}
                    />
                </View>
                <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Input
                        name='body'
                        error={errors.comment ? true : false}
                        errorMessage={errors.comment}
                        labelStyle={{ color: 'gray' }}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        multiline
                        placeholder="Add public comment"
                        onChangeText={(body) => this.setState({ body })}
                        value={this.state.body}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {this._maybeRenderUploadingOverlay()}
                </View>
            </View>
        ) : null
        return commentFormMarkup
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },

})

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    blogId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    user: state.user
})

export default connect(mapStateToProps, { submitComment })(CommentForm)
