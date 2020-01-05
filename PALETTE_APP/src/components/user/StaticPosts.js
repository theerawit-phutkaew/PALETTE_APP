import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native'
import Constants from 'expo-constants';

import AutoHeightImage from 'react-native-auto-height-image';
import MasonryList from '@appandflow/masonry-list'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation'

//component
import LikeButton from '../blog/LikeButton'



export class StaticPosts extends Component {

    _Body = () => {
        const body = this.props.authUserBlog.body
        if (body !== '') {
            return (
                <Text style={{ fontSize: 20, fontWeight: '300' }}>{body}</Text>
            );
        } else {
            return null
        }
    };

    render() {
        const { authUserBlog: { blogImage, userProfile, blogId, body, likeCount, userHandle, commentCount, comments } } = this.props
        return (
            <View style={styles.container}>
                <AutoHeightImage
                    source={{ uri: blogImage[0] }}
                    width={Dimensions.get('window').width}
                />
                <View style={styles.blogDetail}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: userProfile }}
                                style={{ width: 50, height: 50, borderRadius: 75 }}
                            />
                            <TouchableOpacity style={{ flexDirection: 'column', marginLeft: 15 }} onPress={() => this.props.navigation.navigate('Profile')}>
                                <Text style={{ fontSize: 18, fontWeight: '400' }}>{userHandle}</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'normal', color: 'gray' }}>{`Liked ${likeCount}`}</Text>
                            </TouchableOpacity>
                        </View>

                        <LikeButton blogId={blogId} />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        {this._Body()}
                    </View>
                    <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('CommentModel', { comments: comments, blogId: blogId })}>
                    <Text style={{ fontSize: 14, fontWeight: 'normal', color: 'gray' }}>Show all {commentCount} comments</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

    }
}


StaticPosts.propType = {
    authUserBlog: PropTypes.object.isRequired,
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
    comments: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'column',
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray'
    },
})


export default connect(mapStateToProps)(withNavigation(StaticPosts))
