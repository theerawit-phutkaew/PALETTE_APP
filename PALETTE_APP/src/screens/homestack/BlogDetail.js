import React, { Component } from 'react'
import { Text, StyleSheet, View, StatusBar, Dimensions, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types';
import Constants from 'expo-constants';

//Image
import AutoHeightImage from 'react-native-auto-height-image';


//Icon
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

//Redux
import { getBlog, clearErrors } from '../../actions/dataActions';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

//Component
import StaticMoreBlogs from '../../components/blog/StaticMoreBlogs'
import StaticBlog from '../../components/blog/StaticBlog'


export class BlogDetail extends React.Component {


    componentDidMount() {
        const blogId = this.props.navigation.state.params.blog.blogId
        this.props.getBlog(blogId)
    }



    render() {
        const blogImage = this.props.data.blog.blogImage
        const { blog } = this.props.data
        const { UI: { loading } } = this.props
        const blogmarkup = loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        ) : blog === null ? (<Text>...noblog</Text>) : blogImage === undefined ? (<Text>img undefined</Text>) : (
            <ScrollView style={styles.scrollView}>
                <StaticBlog blog={blog} />
                <View style={styles.morePosts}>
                    <StaticMoreBlogs blog={blog} />
                </View>
            </ScrollView>
        )
        return (
            <View style={styles.container}>
                {blogmarkup}
                {loading ? null : (<View style={styles.button}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name='md-arrow-back' size={24} color='white' />
                    </TouchableOpacity>
                </View>)}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    scrollView: {
        marginTop: Constants.statusBarHeight
    },
    moreLikeThis: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'column',
    },
    morePosts: {
        marginTop: 10
    },
    button: {
        marginTop: Constants.statusBarHeight,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 75,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        top: 10,
        left: 10
    }

})


BlogDetail.propTypes = {
    // getBlogs: PropTypes.func.isRequired,
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


export default connect(mapStateToProps, mapActionsToProps)(BlogDetail)