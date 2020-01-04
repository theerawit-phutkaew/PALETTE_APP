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

import { getBlog } from '../../actions/dataActions';

import AutoHeightImage from 'react-native-auto-height-image';
import { connect } from 'react-redux';


export class StaticMoreBlogs extends Component {



    renderItem = ({ item }) => {
        const blog = this.props.blog
        if (blog.blogId === item.blogId) {
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
        this.props.getBlog(item.blogId)
    }


    render() {
        const { blogs } = this.props.data
        return (
            <View style={styles.container}>
                <Text style={{ fontWeight: '300', fontSize: 18, marginLeft: 10 }} >More Like This</Text>
                <View style={{ marginTop: 10 }}>
                    <MasonryList
                        style={{ marginHorizontal: 5 }}
                        data={blogs}
                        keyExtractor={(x, i) => i.toString()}
                        renderItem={this.renderItem}
                        getHeightForItem={({ item }) => 100}
                        numColumns={2}
                    />
                </View>
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

StaticMoreBlogs.propTypes = {
    getBlog: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    blog: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => ({
    data: state.data,
    UI: state.UI
});



export default connect(mapStateToProps, { getBlog })(withNavigation(StaticMoreBlogs)) 
