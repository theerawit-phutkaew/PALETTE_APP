import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator

} from 'react-native'

import Constants from 'expo-constants';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import axios from 'axios';
import { getUserData } from '../../actions/dataActions'


//component
import StaticUserBlogs from '../../components/user/StaticUserBlogs'
import StaticProfile from '../../components/user/StaticProfile'

class UserDetail extends Component {

    state = {
        profile: null,
        blogIdParam: null
    }

    componentDidMount() {
        const handle = this.props.navigation.state.params.blog.userHandle
        const blogId = this.props.navigation.state.params.blog.blogId

        if (blogId) this.setState({ blogIdParam: blogId })

        this.props.getUserData(handle)
        axios
            .get(`/user/${handle}`)
            .then((res) => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch((err) => console.log(err))
    }

    render() {
        const { profile } = this.state
        const { loading, userblogs } = this.props.data
        const userBlogsMarkup = loading ? (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator /></View>) : this.state.profile === null ? null : userblogs[0] === undefined ? (
            <View style={styles.container}>
                <View style={styles.noUserBlogs}>
                    <Text style={{ fontSize: 18, fontWeight: '300', color: 'gray' }}>{profile.handle} have no Blog</Text>
                </View>
            </View>
        ) : (
                <StaticUserBlogs userblogs={userblogs} navigate={this.props.navigation.navigate} destination='UserPost' />
            )
        return (
            <View style={styles.container}>
                <View>
                    {this.state.profile === null ? null : (
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.header}>
                                <Text style={{ fontSize: 18, fontWeight: '300' }}>{this.state.profile.handle}</Text>
                            </View>
                            <StaticProfile profile={this.state.profile} />
                        </View>
                    )}
                </View>
                {userBlogsMarkup}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingVertical: 12,
        marginTop: Constants.statusBarHeight,

    },
    noUserBlogs: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center'
    }
})


UserDetail.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired

};

const mapStateToProps = (state) => ({
    data: state.data
});


export default connect(mapStateToProps, { getUserData })(UserDetail) 