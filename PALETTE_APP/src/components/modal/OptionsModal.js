import React, { Component } from 'react'
import { Text, View, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'

import PropTypes from 'prop-types';
import { Ionicons, Entypo } from '@expo/vector-icons';
import DeleteBlog from '../../components/blog/DeleteBlog'

export class OptionsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false
        }
    }

    changeModalVisibility = (bool) => {
        this.setState({ isModalVisible: bool })
    }

    render() {
        const { blogId } = this.props
        return (
            <View>
                <TouchableOpacity onPress={() => this.changeModalVisibility(true)}>
                    <Entypo name='dots-three-horizontal' size={24} color='white' />
                </TouchableOpacity>
                <Modal transparent={true} visible={this.state.isModalVisible} onRequestClose={() => this.changeModalVisibility(false)} animationType='fade'>
                    <TouchableOpacity activeOpacity={1} disabled={false} style={styles.container} onPress={() => this.changeModalVisibility(false)}>
                        <View style={styles.modal}>
                            <DeleteBlog blogId={blogId} />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modal: {
        width: Dimensions.get('window').width - 60,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 15
    }
})


OptionsModal.propTypes = {
    blogId: PropTypes.string.isRequired
};


export default OptionsModal
