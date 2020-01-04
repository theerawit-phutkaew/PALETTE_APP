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

import AutoHeightImage from 'react-native-auto-height-image';


class StaticBlogs extends React.Component {

    renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 5, padding: 5 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('BlogDetail', { blog: item })}>
                    <AutoHeightImage
                        width={Dimensions.get('window').width / 2.2}
                        source={{ uri: item.blogImage[0] }}
                        style={{borderTopLeftRadius:20,borderTopRightRadius:20,borderBottomLeftRadius:20,borderBottomRightRadius:20 }}
                        
                    />
                </TouchableOpacity>
            </View>
        )
    }
    

    render() {
        const { blogs } = this.props
        return (
            <View style={styles.container}>
                <MasonryList
                    style={{ marginHorizontal: 5 }}
                    data={blogs}
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

StaticBlogs.propTypes = {
    blogs: PropTypes.array.isRequired,
};



export default withNavigation(StaticBlogs);