import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import Constants from 'expo-constants';

import Image from 'react-native-scalable-image'
import MasonryList from '@appandflow/masonry-list'

import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation'


class StaticUserBlogs extends React.Component {

    renderItem = ({ item }) => {
        const { userblogs } = this.props
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 5, padding: 5 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigate(this.props.destination, { blogId: item.blogId, userblogs: userblogs })}>
                    <Image
                        source={{ uri: item.blogImage[0] }}
                        width={Dimensions.get('window').width / 3.3}
                    />
                </TouchableOpacity>
            </View>
        )
    }


    render() {
        const { userblogs } = this.props
        return (
            <View style={styles.container}>
                <MasonryList
                    style={{ marginHorizontal: 5 }}
                    data={userblogs}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={this.renderItem}
                    getHeightForItem={({ item }) => 100}
                    numColumns={3}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

StaticUserBlogs.propTypes = {
    userblogs: PropTypes.array.isRequired,
};



export default withNavigation(StaticUserBlogs);