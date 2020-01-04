import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    Platform,
    TextInput,
    ScrollView,
    LayoutAnimation,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,

} from 'react-native'

import Image from 'react-native-scalable-image'
import MasonryList from '@appandflow/masonry-list'
import { Card } from 'react-native-elements'
import {
    Ionicons,
    MaterialIcons
} from '@expo/vector-icons';
import Constants from 'expo-constants';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBlogs } from '../../actions/dataActions';

import StaticBlogs from '../../components/blog/StaticBlogs'

class HomeScreen extends React.Component {

    componentDidMount() {
        this.props.getBlogs()
    }

    render() {
        // const { UI: { loading } } = this.props

        const { blogs, loading } = this.props.data
        const blogsMarkup = loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        ) : (
                <View style={styles.container}>
                    <StaticBlogs blogs={blogs} />
                </View>
            )
        return blogsMarkup
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight
    },
})


HomeScreen.propTypes = {
    getBlogs: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => ({
    data: state.data,
    UI: state.UI,
});

export default connect(mapStateToProps, { getBlogs })(HomeScreen);
