import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text,
  View,Image,StyleSheet} from 'react-native';
import {Button,Input} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import IP from '../constants/IP.js';



class changePassword extends React.Component{
  constructor(props){
    super(props)
    this.state={
      userid:this.props.navigation.getParam('userid',null)
    }

  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Change Password',
      headerRight:<Button type='clear' onPress={()=>{console.log('')}} title='Save'/>
    }
  }

render(){
  return(
    <View style={{alignItems:'center',justifyContent:'center'}}>
      <Input placeholder='Current Password'/>
      <Input placeholder='New Password'/>
      <Input placeholder='Repeat New Password'/>
    </View>
    )
  }
}

export default changePassword
