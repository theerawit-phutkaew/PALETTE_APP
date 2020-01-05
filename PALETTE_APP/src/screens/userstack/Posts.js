import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import Constants from 'expo-constants';

import { Ionicons, Entypo } from '@expo/vector-icons';

import Image from 'react-native-scalable-image'
import MasonryList from '@appandflow/masonry-list'

import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation'
import { getBlogUser } from '../../actions/userActions';

//component
import StaticPosts from '../../components/user/StaticPosts'
import OptionsModal from '../../components/modal/OptionsModal'
import StaticUserMorePosts from '../../components/user/StaticUserMorePosts'
import { connect } from 'react-redux';


export class Posts extends Component {




    componentDidMount() {
        const blogId = this.props.navigation.state.params.blogId
        this.props.getBlogUser(blogId)
    }


    render() {
        const { authUserBlog, authUserBlogs } = this.props.user
        const { UI: { loading } } = this.props

        const blogmarkup = loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator />
            </View>
        ) : authUserBlog === undefined ? (
            <Text>...noblog</Text>
        ) : (
                    <ScrollView style={styles.scrollView}>
                        <StaticPosts authUserBlog={authUserBlog} />
                        {
                            authUserBlogs === 1 ? null : (<StaticUserMorePosts authUserBlog={authUserBlog} />)
                        }
                    </ScrollView>
                )

        const OptionsMarkup = loading ? null : authUserBlog === null ? (
            <Text>...noblog</Text>
        ) : authUserBlog === undefined ? (
            <Text>undefined</Text>
        ) : (<OptionsModal blogId={authUserBlog.blogId} />)

        return (
            <View style={styles.container}>
                {blogmarkup}
                {
                    loading ? null : (
                        <View style={styles.button}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.icon}>
                                <Ionicons name='md-arrow-back' size={24} color='white' />
                            </TouchableOpacity>
                            <View style={styles.text}>
                                {OptionsMarkup}
                            </View>
                        </View>
                    )
                }
            </View>
        )

    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    button: {
        marginTop: Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 10,
        left: 10
    },
    text: {
        marginLeft: 5,
        width: 50,
        height: 50,
        borderRadius: 75,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 75,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#E13C3F'
    },
})

Posts.propTypes = {
    user: PropTypes.object.isRequired,
    getBlogUser: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    user: state.user
});

const mapActionsToProps = {
    getBlogUser,

};

export default connect(mapStateToProps, mapActionsToProps)(Posts)
