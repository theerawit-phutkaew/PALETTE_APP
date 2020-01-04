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


import MasonryList from '@appandflow/masonry-list'

import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation'

import { getBlogUser } from '../../actions/userActions';

import AutoHeightImage from 'react-native-auto-height-image';
import { connect } from 'react-redux';


export class StaticUserMorePosts extends Component {



    renderItem = ({ item }) => {
        const authUserBlog = this.props.authUserBlog
        if (authUserBlog.blogId === item.blogId) {
            return null
        } else {
            return (
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 5, padding: 5 }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => this._getBlog(item)}>
                        <AutoHeightImage
                            width={Dimensions.get('window').width / 2.2}
                            source={{ uri: item.blogImage[0] }}
                            style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}

                        />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    _getBlog = (item) => {
        this.props.getBlogUser(item.blogId)
    }


    render() {
        const { authUserBlogs } = this.props.user
        return (
            <View style={styles.container}>
                <MasonryList
                    style={{ marginHorizontal: 5 }}
                    data={authUserBlogs}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={this.renderItem}
                    getHeightForItem={({ item }) => 100}
                    numColumns={2}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: Constants.statusBarHeight
    },
})

StaticUserMorePosts.propTypes = {
    getBlogUser: PropTypes.func.isRequired,
    authUserBlog: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});



export default connect(mapStateToProps, { getBlogUser })(withNavigation(StaticUserMorePosts)) 
