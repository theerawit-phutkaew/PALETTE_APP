import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native'

import Constants from 'expo-constants';
import Image from 'react-native-scalable-image'
import MasonryList from '@appandflow/masonry-list'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';


class UserBlogsComponent extends React.Component {

    renderItem = ({ item }) => {
        return (

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 5, padding: 5 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Post', { item })}>
                    <Image
                        source={{ uri: item.blogImage[0] }}
                        width={Dimensions.get('window').width / 3.3}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const { userBlogs } = this.props.user
            return (
                <View style={styles.container}>
                <MasonryList
                    style={{ marginHorizontal: 5 }}
                    data={userBlogs}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={this.renderItem}
                    getHeightForItem={({ item }) => 100}
                    numColumns={3}
                />
            </View>
            )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

UserBlogsComponent.propType = {
    user: PropTypes.object.isRequired,
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})

export default connect(mapStateToProps)(UserBlogsComponent)