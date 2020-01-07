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

import { Ionicons } from '@expo/vector-icons';

import Image from 'react-native-scalable-image'
import MasonryList from '@appandflow/masonry-list'

import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation'
import { getBlog } from '../../actions/dataActions';

//component
import AnotherUserPosts from '../../components/blog/AnotherUserPosts'
import AnotherUserMorePosts from '../../components/blog/AnotherUserMorePosts'
import { connect } from 'react-redux';



export class UserPosts extends Component {



    componentDidMount() {
        const blogId = this.props.navigation.state.params.blogId
        this.props.getBlog(blogId)

    }


    render() {
        const userblogs = this.props.navigation.state.params.userblogs
        const { blog } = this.props.data
        const { UI: { loading } } = this.props

        const blogmarkup = loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'white' }}>
                <ActivityIndicator />
            </View>
        ) : blog === undefined ? (<Text>...noblog</Text>) : (
            <ScrollView style={styles.scrollView}>
                <AnotherUserPosts blog={blog} />
                {
                    userblogs.length === 1 ? null : (<AnotherUserMorePosts blog={blog} userblogs={userblogs} />)
                }
            </ScrollView>
        )
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
                                <Text style={{ fontWeight: '300', fontSize: 18, color: 'white' }}>Posts</Text>
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
        backgroundColor: '#E13C3F'
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 75,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        marginLeft: 5,
        width: 75,
        height: 50,
        borderRadius: 75,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
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
    scrollView: {
        marginTop: Constants.statusBarHeight
    },
})

UserPosts.propTypes = {
    data: PropTypes.object.isRequired,
    getBlog: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    data: state.data
});

const mapActionsToProps = {
    getBlog,
};

export default connect(mapStateToProps, mapActionsToProps)(UserPosts)
