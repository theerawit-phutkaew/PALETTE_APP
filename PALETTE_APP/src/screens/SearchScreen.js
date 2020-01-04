import React, { Component } from 'react'
import { 
    Text, 
    StyleSheet, 
    View, 
    SafeAreaView, 
    TextInput,
    Platform,
    StatusBar,
 } from 'react-native'
import { Ionicons } from '@expo/vector-icons';


export default class SearchScreen extends React.Component {

    static navigationOptions = {
        header: null
    }

    componentWillMount(){
        this.startHeaderHight = 80
        if(Platform.OS =='android'){
            this.startHeaderHight = 100 + StatusBar.currentHeight
        }
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={styles.headerBar}>
                        <View style={styles.Search}>
                            <Ionicons name='ios-search' size={24} style={{marginRight:10}} color={'gray'}/>
                            <TextInput placeholder='Search' placeholderTextColor='gray'  style={{flex:1,}}/>
                        </View>

                    </View>

                </View>
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    headerBar: {
        height: this.startHeaderHight,
        backgroundColor: '#E6DEDC',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.2,
    },
    Search: {
        flexDirection:'row',
        padding:10,
        backgroundColor:'#E6DEDC',
        marginTop:Platform.OS=='android'? 30: null,
    }
})
