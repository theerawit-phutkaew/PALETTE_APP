import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Platform, Image, ActivityIndicator, ImageEditor } from 'react-native'
import { Input } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator'

//import ImagePicker from 'react-native-image-picker';

//import Image from 'react-native-scalable-image'

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadImage } from '../../actions/userActions';
import FormData from 'form-data'
import axios from 'axios';




export class ProfileUpload extends Component {
    state = {
        profileUrl: null,
        uploading: false,
        pickerResult: null
    };



    mapprofileUrlToState = (credentials) => {
        this.setState({
            profileUrl: credentials.profileUrl
        })
    }

    componentWillMount() {
        this.mapprofileUrlToState(this.props.credentials)
    }


    componentDidMount() {
        this.getPermissionAsync()
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!')
            }
        }
    }




    _takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [3, 3],
            });

            this._handleImagePicked(pickerResult);
        }
    };


    _pickImage = async () => {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera roll
        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [3, 3],
            });

            if (!pickerResult.cancelled) {
                this.setState({ pickerResult: pickerResult })
                
                const manipResult = await ImageManipulator.manipulateAsync(
                    pickerResult.uri,
                    [{ resize: { width: 300 } }],
                    { compress: 1, format: ImageManipulator.SaveFormat.PNG }
                );

                this.setState({ profileUrl: manipResult.uri, pickerResult: pickerResult })

                this.setState(
                    (prevState) => ({
                        pickerResult: Object.assign({}, prevState.pickerResult, {
                            uri: manipResult.uri
                        })
                    }))

                this._result()
                
            } else {
                console.log('cancelled');
                //  this.props.navigation.goBack()
            }
        }
    };


    _result = () => {
        const pickerResult = this.state.pickerResult
        this._handleImagePicked(pickerResult);
    }





    _handleImagePicked = async pickerResult => {
        let uploadResponse

        try {
            this.setState({
                uploading: true
            });

            if (!pickerResult.cancelled) {
                uploadResponse = await uploadImageAsync(pickerResult.uri);
            }
        } catch (e) {
            console.log({ uploadResponse });
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({
                uploading: false,
                profileUrl: pickerResult.uri
            });
        }
    };

    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View>
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <TouchableOpacity style={{ marginTop: 15 }} onPress={this._pickImage}>
                    <Text style={{ fontSize: 18, fontWeight: '100', color: '#E13C3F' }}>Change Profile Photo</Text>
                </TouchableOpacity>
            )
        }
    };


    render() {
        const { profileUrl } = this.state
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Image
                    source={{ uri: profileUrl }}
                    style={{ width: 100, height: 100, borderRadius: 75 }}
                />
                {this._maybeRenderUploadingOverlay()}
            </View>

        )
    }


}



async function uploadImageAsync(uri) {
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append('photo', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
    });



    return axios.post('/profile', formData)

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profile: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 10,
        alignItems: 'center'
    }

})


ProfileUpload.propTypes = {
    uploadImage: PropTypes.func.isRequired,
    credentials: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});



export default connect(mapStateToProps, { uploadImage })(ProfileUpload)
