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
import { getBlog, clearErrors } from '../../actions/dataActions'

import { withNavigation } from 'react-navigation'

import Comments from '../../components/blog/Comments'
import CommentForm from '../../components/blog/CommentForm'



export class CommentScreen extends Component {

    componentDidMount() {
        const blogId = this.props.navigation.state.params.blogId
        this.props.getBlog(blogId)
    }


    render() {
        const { blog } = this.props.data
        const { UI: { loading } } = this.props
        const commentMarkup = loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        ) :  (
            <SafeAreaView style={styles.container}>
                <StatusBar />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name='md-arrow-back' size={24} color='gray' />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: '300', fontSize: 18, marginLeft: 10 }}>Comments</Text>
                </View>
                <ScrollView >
                    <View style={{ flex: 1 }}>
                        <Comments blog={blog} />
                    </View>

                </ScrollView>
                <KeyboardAvoidingView behavior="padding">
                    <Footer style={{ backgroundColor: 'white' }}>
                        <CommentForm blogId={blog.blogId} />
                    </Footer>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
        return commentMarkup
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 12,
        //  borderBottomColor: 'gray',
        // borderBottomWidth: 1,
        marginTop: Constants.statusBarHeight
    },
    user: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 15,

    },
    input: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    image: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    }
})

CommentScreen.propTypes = {
    getBlog: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    data: state.data,
    UI: state.UI
});

const mapActionsToProps = {
    getBlog,
    clearErrors
};


export default connect(mapStateToProps, mapActionsToProps)(CommentScreen)
