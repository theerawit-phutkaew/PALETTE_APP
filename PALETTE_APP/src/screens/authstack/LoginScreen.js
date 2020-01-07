import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ActivityIndicator,
    AsyncStorage
} from 'react-native'
import { Button, Text, Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';


import { connect } from 'react-redux'
import { loginUser } from '../../actions/userActions'


class LoginScreen extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const userData = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.loginUser(userData, this.props.navigation)

    }

    render() {
        const { UI: { loading } } = this.props
        const { errors } = this.state
        return (
            <KeyboardAvoidingView style={styles.container} behavior='padding' >
                <View style={{ backgroundColor: '#E13C3F', paddingTop: 60, paddingLeft: 10, paddingBottom: 50, }}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>WELCOME TO</Text>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>Palette.</Text>
                </View>
                <View style={{ marginTop: 40, padding: 20 }}>
                    <Input
                        label='Email'
                        labelStyle={{ color: '#E13C3F' }}
                        inputContainerStyle={{ borderBottomColor: '#E13C3F' }}
                        placeholder='email@adress.com'
                        errorStyle={{ color: 'red' }}
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        errorMessage={errors.email}

                    />
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <Input
                        label='Password'
                        labelStyle={{ color: '#E13C3F' }}
                        inputContainerStyle={{ borderBottomColor: '#E13C3F' }}
                        secureTextEntry={true}
                        placeholder='Password'
                        errorStyle={{ color: 'red' }}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        errorMessage={errors.password}

                    />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    {errors.general && (<Text style={{ color: 'red' }}>อีเมลหรือรหัสผ่านผิดพลาดกรุณาลองใหม่อีกครั้ง</Text>)}
                </View>


                <View style={styles.buttonContainer}>

                    <View style={{ width: 170 }}>

                        <Button
                            title='สมัครสมาชิค'
                            type='outline'
                            titleStyle={{ color: '#E13C3F' }}
                            buttonStyle={{ borderColor: '#E13C3F' }}
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        />
                    </View>
                    <View style={{ width: 170 }}>
                        <Button
                            title='เข้าสู่ระบบ'
                            type='solid'
                            titleStyle={{ color: 'white' }}
                            buttonStyle={{ backgroundColor: '#E13C3F'}}
                            onPress={this.handleSubmit}
                            disabled={loading}
                        >
                            {loading && (<ActivityIndicator />)}
                        </Button>
                    </View>
                </View>


            </KeyboardAvoidingView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'

    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'space-between',
        //   backgroundColor: 'black'
    }
})

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionToProps)(LoginScreen)

