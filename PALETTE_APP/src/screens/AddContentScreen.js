import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Text,
  StatusBar,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  ImageEditor,
  Dimensions,
  Image
} from 'react-native'
import { Footer, Header } from 'native-base'
import PropTypes from 'prop-types';

import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux'

import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { getBlogs } from '../actions/dataActions'
import { getUserData } from '../actions/userActions'

import * as ImageManipulator from 'expo-image-manipulator'


import AutoHeightImage from 'react-native-auto-height-image';
//import Image from 'react-native-scalable-image'



import axios from 'axios';



class AddContentScreen extends React.Component {

  state = {
    image: null,
    uploading: false,
    textfield: '',
    pickerResult: null
  };


  componentDidMount() {
    const { loading, authenticated } = this.props.user
    if (authenticated === true) {
      this.getPermissionAsync()
      this._pickImage()
    }
  }
  /*
    _authenticated = () => {
      const { loading, authenticated } = this.props.user
      if (authenticated !== true) {
        return (
          <View>
            <Button
              title='LOGIN'
              type='solid'
              titleStyle={{ color: 'white' }}
              buttonStyle={{ backgroundColor: '#E13C3F', width: 250 }}
              onPress={() => this.props.navigation.navigate('Login')}
            />
          </View>
        )
      } else {
        this.getPermissionAsync()
        this._pickImage()
      }
    }
  */
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1
      });

      if (!pickerResult.cancelled) {
        this.setState({ pickerResult: pickerResult })

        const manipResult = await ImageManipulator.manipulateAsync(
          pickerResult.uri,
          [{ resize: { width: 500 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      this.setState({ image: manipResult.uri, pickerResult: pickerResult })

      this.setState(
          (prevState) => ({
              pickerResult: Object.assign({}, prevState.pickerResult, {
                  uri: manipResult.uri
              })
          }))

      } else {
        console.log('cancelled');
        this.props.navigation.goBack()
      }
    }
  };



  handleSubmit = () => {
    const pickerResult = this.state.pickerResult
    this._handleImagePicked(pickerResult)
  }

  handleClose = () => {
    this.props.navigation.navigate('Home')
    this.props.getBlogs()
    this.props.getUserData()
  }



  _handleImagePicked = async pickerResult => {
    let textfield = this.state.textfield
    let uploadResponse
    console.log(this.state);

    try {
      this.setState({
        uploading: true
      });
      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri, textfield);
      } else {
        console.log('cancle');
      }
    } catch (e) {
      console.log({ uploadResponse });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false,
        image: pickerResult.uri
      });
      this.handleClose()
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
        <TouchableOpacity onPress={this.handleSubmit} >
          <Text style={{ fontWeight: '300', fontSize: 18 }}>POST</Text>
        </TouchableOpacity>
      )
    }
  };


  render() {
    const { credentials: { bio, blogCount, handle, email, profileUrl }, authenticated } = this.props.user
    const { image } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        {
          this.props.user.authenticated ? (
            <View>
              <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Ionicons name='md-arrow-back' size={24} color='gray' />
                  </TouchableOpacity>
                  <Text style={{ fontWeight: '300', fontSize: 18, marginLeft: 10 }}>Create Post</Text>
                </View>
                {this._maybeRenderUploadingOverlay()}
              </View>


              <ScrollView>
                <View style={styles.user}>
                  <View>
                    <Image
                      source={{ uri: profileUrl }}
                      style={{ width: 50, height: 50, borderRadius: 75 }}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: '300' }}>{handle}</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'normal', color: 'gray' }}>{email}</Text>
                  </View>
                </View>

                <View style={styles.input}>
                  <Input
                    name='textfield'
                    labelStyle={{ color: 'gray' }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    multiline
                    placeholder="What's on your mind?"
                    onChangeText={(textfield) => this.setState({ textfield })}
                    value={this.state.textfield}
                  />
                </View>

                <View style={styles.image}>
                  <AutoHeightImage
                    width={Dimensions.get('window').width - 30}
                    source={{ uri: image }}
                  />
                </View>
              </ScrollView>
            </View>
          ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  title='LOGIN'
                  type='solid'
                  titleStyle={{ color: 'white' }}
                  buttonStyle={{ backgroundColor: '#E13C3F', width: 250 }}
                  onPress={() => this.props.navigation.navigate('Login')}
                />
              </View>
            )
        }

      </SafeAreaView>

    )
  }
}

async function uploadImageAsync(uri, textfield) {
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  })
  formData.append('textfield', textfield)

  return axios.post('/post', formData)

}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapActionsToProps = {
  getUserData,
  getBlogs
};

AddContentScreen.propTypes = {
  user: PropTypes.object.isRequired,
  getBlogs: PropTypes.func.isRequired,
  getUserData: PropTypes.func.isRequired
  // uploadImage:PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginTop: Constants.statusBarHeight
  },
  user: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,

  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  image: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  }
})


export default connect(mapStateToProps, mapActionsToProps)(AddContentScreen)