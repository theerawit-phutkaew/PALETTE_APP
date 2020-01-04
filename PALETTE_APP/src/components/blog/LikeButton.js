import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types';
//Icon
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

//Redux
import { connect } from 'react-redux';
import { likeBlog, unlikeBlog } from '../../actions/dataActions'

export class LikeButton extends Component {

    likedBlog = () => {
        if (this.props.user.likes && this.props.user.likes.find(
            (like) => like.blogId === this.props.blogId
        )
        )
            return true
        else return false
    }

    likeBlog = () => {
        this.props.likeBlog(this.props.blogId)
        console.log('like');
    }

    unlikeBlog = () => {
        this.props.unlikeBlog(this.props.blogId)
        console.log('unlike');
    }

    render() {
        const likeButton = this.likedBlog() ? (
            <TouchableOpacity onPress={this.unlikeBlog}>
                <Ionicons name='md-heart' size={30} color='red' />
            </TouchableOpacity>
        ) : (
                <TouchableOpacity onPress={this.likeBlog}>
                    <Ionicons name='md-heart-empty' size={30} color='gray' />
                </TouchableOpacity>
            )


        return likeButton
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    blogId: PropTypes.string.isRequired,
    likeBlog: PropTypes.func.isRequired,
    unlikeBlog: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeBlog,
    unlikeBlog,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
