import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native'
import { Ionicons, } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Image from 'react-native-scalable-image'
import MasonryList from '@appandflow/masonry-list'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';



const StaticProfile = (props) => {
    const { profile: { handle, blogCount, profileUrl, bio, email} } = props

return (
    <View >
        <View style={styles.userDetail}>
            <View style={{ flex: 4, flexDirection: 'row', }}>
                <Image
                    source={{ uri: profileUrl }}
                    width={75}
                    borderRadius={75}
                />
                <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: '300' }}>{handle}</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'normal', color: 'gray' }}>{email}</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'normal', color: 'gray' }}>{bio}</Text>
                </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 15, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '300' }}>{blogCount}</Text>
                <Text style={{ fontSize: 13, fontWeight: 'normal', color: 'gray' }}>Posts</Text>
            </View>
        </View>
    </View>
)
}

StaticProfile.propType = {
    profile: PropTypes.object.isRequired,

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
    userDetail: {
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: 'row',
    }
})

export default StaticProfile