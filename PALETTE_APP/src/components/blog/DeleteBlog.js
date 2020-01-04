import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native'
import PropTypes from 'prop-types';
//Icon
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

//Redux
import { connect } from 'react-redux';
import { deleteBlog } from '../../actions/dataActions'
import { getUserData } from '../../actions/userActions'
import { withNavigation } from 'react-navigation'


export class DeleteBlog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false
        }
    }

    changeModalVisibility = (bool) => {
        this.setState({ isModalVisible: bool })
    }


    deleteBlog = () => {
        this.props.deleteBlog(this.props.blogId);
        this.setState({ open: false });
        this.props.navigation.navigate('Profile')
        this.props.getUserData()
    };


    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.changeModalVisibility(true)}>
                    <Text style={{ fontWeight: '300', fontSize: 18, marginLeft: 10 }} >Delete</Text>
                </TouchableOpacity>
                <Modal transparent={true} visible={this.state.isModalVisible} onRequestClose={() => this.changeModalVisibility(false)} animationType='fade'>
                    <TouchableOpacity activeOpacity={1} disabled={false} style={styles.container} >
                        <View style={styles.modal}>
                            <View style={styles.confirm}>
                                <Text style={{ fontWeight: '300', fontSize: 16 }}>Confirm Deletion</Text>
                                <Text style={{ fontWeight: '100', fontSize: 12, color: 'gray', marginTop: 10 }}>Delete this post?</Text>
                            </View>
                            <TouchableOpacity style={styles.delete} onPress={this.deleteBlog}>
                                <Text style={{ fontWeight: '300', fontSize: 16, color: '#E13C3F' }}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.delete} onPress={() => this.changeModalVisibility(false)}>
                                <Text style={{ fontWeight: '300', fontSize: 16 }}>Don't delete</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

        )
    }
}

DeleteBlog.propTypes = {
    getUserData: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    blogId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
    getUserData,
    deleteBlog
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modal: {
        width: Dimensions.get('window').width - 100,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    delete: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        paddingVertical: 15
    },
    confirm: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        paddingVertical: 20
    }
})


export default connect(mapStateToProps, mapActionsToProps)(withNavigation(DeleteBlog));
