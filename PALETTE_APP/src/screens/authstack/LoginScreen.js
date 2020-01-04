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
                    <Text style={{ fontSize: 17, color: 'white' }}>เชื่อมต่อประสบการณ์ที่ดีให้คุณ</Text>
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

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Button
                        title='เข้าสู่ระบบ'
                        type='solid'
                        titleStyle={{ color: 'white' }}
                        buttonStyle={{ backgroundColor: '#E13C3F', width: 250 }}
                        onPress={this.handleSubmit}
                        disabled={loading}
                    >
                        {loading && (<ActivityIndicator />)}
                    </Button>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                    <Text style={{ color: 'gray' }}>หรือเข้าสู่ระบบด้วย</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <View style={{ marginTop: 30 }}>
                        <Button
                            title='เข้าสู่ระบบด้วย Facebook'
                            type='outline'
                            icon={<Ionicons name='logo-facebook' size={30} color='#4064AD' />}
                            titleStyle={{ color: 'gray', fontSize: 13, marginLeft: 10 }}
                            buttonStyle={{ borderColor: '#E13C3F', width: 250, height: 35, justifyContent: 'center' }}
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Button
                            title='เข้าสู่ระบบด้วย Google'
                            type='outline'
                            icon={<Ionicons name='logo-google' size={30} color='#ED501E' />}
                            titleStyle={{ color: 'gray', fontSize: 13, marginLeft: 10 }}
                            buttonStyle={{ borderColor: '#E13C3F', width: 250, height: 35, justifyContent: 'center' }}
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        />
                    </View>
                </View>


                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60, flexDirection: 'row' }}>
                    <Button
                        title='สมัครสมาชิค'
                        type='clear'
                        titleStyle={{ color: 'gray', fontSize: 13 }}
                        onPress={() => this.props.navigation.navigate('SignUp')}
                    />
                    <Button
                        title='นโยบายคุ้มครอง'
                        type='clear'
                        titleStyle={{ color: 'gray', fontSize: 13 }}
                        onPress={() => this.props.navigation.navigate('SignUp')}
                    />
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
        flexDirection: 'column',
        marginTop: 50,
        alignItems: 'center',

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

