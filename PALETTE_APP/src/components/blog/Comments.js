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
import PropTypes from 'prop-types';

import { connect } from 'react-redux'

import { withNavigation } from 'react-navigation'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export class Comments extends Component {
    state = {
        comments: [],
    }

    handleNavigate = (comment) => {
        const { credentials } = this.props.user
        if (comment.userHandle !== credentials.handle) {
            this.props.navigation.navigate('UserDetail', { blog: comment })
        } else {
            this.props.navigation.navigate('ProfileStack')
        }
    }

    mapUserDetailsToState = (blog) => {
        this.setState({
            comments: blog.comments ? blog.comments  : [],
        })
    }

    componentWillMount() {
        this.mapUserDetailsToState(this.props.blog)
    }

    componentDidMount() {
        const { blog } = this.props
        this.mapUserDetailsToState(blog)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.blog.comments){
            this.setState({comments:nextProps.blog.comments})
        }
    }

    render() {
        dayjs.extend(relativeTime)

        const { comments } = this.state
        const commentMarkup = comments[0] === undefined ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 300 }}>
                <Text style={{ fontSize: 18, fontWeight: 'normal', color: 'gray' }}>Share feedback</Text>
            </View>
        ) : (
                <View style={styles.container}>
                    {comments.map((comment, index) => {
                        const { body, createdAt, userHandle, userProfile } = comment
                        const time = dayjs(createdAt).fromNow()
                        return (
                            <View key={index} style={styles.commentDialog}>
                                <View >
                                    <Image
                                        source={{ uri: userProfile }}
                                        style={{ width: 45, height: 45, borderRadius: 75 }}
                                    />
                                </View>
                                <View style={styles.commentText}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.handleNavigate(comment)}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{userHandle}</Text>
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 16, fontWeight: 'normal', color: 'gray', marginLeft: 10 }}>{time}</Text>
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 'normal' }}>{body}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
            )
        return (
            <View style={styles.container}>
                {commentMarkup}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    commentDialog: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',

    },
    commentText: {
        marginLeft: 10,
        marginRight: 50,
        flexDirection: 'column',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: '#E13C3F',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        backgroundColor: 'white'

    }
})


Comments.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps)(withNavigation(Comments))
