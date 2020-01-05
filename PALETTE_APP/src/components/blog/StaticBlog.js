import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    TouchableHighlight

} from 'react-native'

import Image from 'react-native-scalable-image'
import PropTypes from 'prop-types';
import LikeButton from '../blog/LikeButton'

import { connect } from 'react-redux'

import { withNavigation } from 'react-navigation'

import Comments from '../blog/Comments'



class StaticBlog extends React.Component {


    handleNavigate = () => {
        const { credentials } = this.props.user
        const { blog } = this.props
        if (blog.userHandle !== credentials.handle) {
            this.props.navigation.navigate('UserDetail', { blog: blog })
        } else {
            this.props.navigation.navigate('ProfileStack')
        }

    }

    _Body = () => {
        const body = this.props.blog.body
        if (body !== '') {
            return (
                <Text style={{ fontSize: 20, fontWeight: '300' }}>{body}</Text>
            );
        } else {
            return null
        }
    };

    render() {
        const { blog: { blogImage, userProfile, blogId, body, likeCount, userHandle, commentCount, comments } } = this.props
        return (
            <View style={styles.container}>
                <Image
                    source={{ uri: blogImage[0] }}
                    width={Dimensions.get('window').width}
                />
                <View style={styles.blogDetail}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: userProfile }}
                                width={50}
                                borderRadius={75}
                            />
                            <TouchableOpacity style={{ flexDirection: 'column', marginLeft: 15 }} onPress={this.handleNavigate}>
                                <Text style={{ fontSize: 18, fontWeight: '400' }}>{userHandle}</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'normal', color: 'gray' }}>{`Liked ${likeCount}`}</Text>
                            </TouchableOpacity>
                        </View>

                        <LikeButton blogId={blogId} />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        {this._Body()}
                    </View>
                    <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('CommentModel', { comments: comments, blogId: blogId })}>
                        <Text style={{ fontSize: 14, fontWeight: 'normal', color: 'gray' }}>Show all {commentCount} comments</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

    }
}


StaticBlog.propType = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    user: state.user,
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingVertical: 12,

    },
    blogDetail: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingBottom: 20,
        flexDirection: 'column',

    },
})

export default connect(mapStateToProps)(withNavigation(StaticBlog))