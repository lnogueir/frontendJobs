import React, {Component} from 'react';
import {AsyncStorage,TextInput,Alert,
  TouchableWithoutFeedback,Keyboard,
  KeyboardAvoidingView,
  Text,View,Image} from 'react-native';
import {Input,Button,Header} from 'react-native-elements';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import IP from '../constants/IP.js';
import loginStyle from '../styles/loginStyle.js'

// const IP = "http://192.168.0.16"
// const IP = "http://172.20.10.6"

class loginPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    username:null,
    password:null,
    checked:false,
    error:'',
    userid:null,
    location:null
  };
  }


  // componentDidMount = () =>{
  //   AsyncStorage.getItem('userid').then((user)=>{
  //     this.props.navigation.dispatch(NavigationActions.reset({
  //       index:0,
  //       actions:[NavigationActions.navigate({routeName:})]
  //     }))
  //   })
  // }

  static navigationOptions = ({navigation}) => {
    return {
      // headerLeft:<Button title=' Search' onPress={() => navigation.goBack()}/>,
      title: 'Authentication',
    }
  }


  getToken = async () => {
    // Remote notifications do not work in simulators, only on device
    if (!Expo.Constants.isDevice) {
      return;
    }
    let { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.NOTIFICATIONS
    );
    if (status !== 'granted') {
      return;
    }
    let token = await Expo.Notifications.getExpoPushTokenAsync();
    // console.log('Our token', token);
    let url = IP+":3000/api/notifications/createNotification";
    // console.log(this.state.userid);
    let notificationInfo = {
       userID: this.state.userid,
       location: this.state.location.split(',')[0],
       tag:'', // Trocar depois esta poha
       token: token,
    }
    try{
      let response = await fetch(url,{
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(notificationInfo)
      });
      let responseJson = await response.json();
      console.log(responseJson)
      if(responseJson.error!=undefined){
        alert("Error allowing notification 💩")
      }
      return responseJson.result;
    }catch(error){
      console.log(error)
    }
  }



  getUserInfo = async () =>{
    let url = IP+":3000/api/profiles/userID?q="+this.state.userid;
    await fetch(url)
    .then((response)=>response.json())
    .then((responseJson)=>{
        // console.log(responseJson)
        this.setState(state=>({location:responseJson.profile[0].location}));
    })
  }

  alertAllowNotifications = async () =>{
    return new Promise((resolve,reject)=>{
      Alert.alert(
        'Allow notifications',
        'Would you like to receive notifications of new jobs in your area?',
        [
          {text:'No', onPress:()=>{resolve('YES')}},
          {text:'Yes',onPress:async()=>{
            await this.getUserInfo();
            this.getToken();
            await AsyncStorage.setItem('notification', 'true');
            resolve('YES')
          }},
        ],
        {cancelable:false}
      )
    })
  }



  handleLogin = async () => {
    // console.log('hello')
    let userData = {
       username:this.state.username,
       password:this.state.password
     }
     var url = IP+':3000/api/Users/login'
     try{
       let response = await fetch(url,{
         method:'POST',
         headers:{
           'Accept':'application/json',
           'Content-Type':'application/json',
         },
         body:JSON.stringify(userData)
       });
       let responseJson = await response.json();
       if(responseJson.error==undefined){
         await AsyncStorage.setItem('userid', responseJson.userId.toString());
         this.setState({userid:responseJson.userId.toString()})
         await this.alertAllowNotifications()
         this.props.navigation.navigate('Main');
       }else{
         this.setState({error:'Sorry, username and/or password invalid.'})
         // alert("Sorry, the username or password is wrong. 💩")
       }
       return responseJson.result;
     }catch(error){
       // console.log('hello')
       console.log(error)
     }

  }


  render(){
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={loginStyle.container}>
          <View style={loginStyle.logoContainer}>
            <Image
              style={loginStyle.logoStyle}
              source={require('../assets/PlanetJobFull.png')}
            />
          </View>
          <View style={loginStyle.inputView}>
            <Input
              returnKeyType={'next'}
              clearButtonMode='while-editing'
              onChangeText={(text) => this.setState({username:text})}
              value={this.state.username}
              onSubmitEditing={()=>this.passwordInput.focus()}
              blurOnSubmit={false}
              autoCorrect={false}
              inputStyle={loginStyle.inputStyle}
              containerStyle={loginStyle.containerStyle}
              leftIcon={<MatIcon name='account-circle' color='#45546d' size={32}/>}
              placeholder='Username'
              placeholderTextColor='#45546d'
            />
            <Input
              returnKeyType={'go'}
              onSubmitEditing={()=>this.handleLogin()}
              ref={(input)=>{this.passwordInput = input}}
              clearButtonMode='while-editing'
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={(text) => this.setState({password:text})}
              value={this.state.password}
              inputStyle={loginStyle.inputStyle}
              containerStyle={loginStyle.containerStyle}
              leftIcon={<MatIcon name='lock' color='#45546d' size={32}/>}
              placeholder='Password'
              placeholderTextColor='#45546d'
            />
            <Text style={{color:'red'}}>{this.state.error}</Text>
            <Text style={loginStyle.forgotStyle}>Forgot Password?</Text>
          </View>
          <View style={loginStyle.buttonViewLogin}>
            <Button onPress={()=>this.handleLogin()}
            buttonStyle={[loginStyle.buttonsStyle,{backgroundColor:'#1968e8'}]}
            title='Sign in' titleStyle={loginStyle.buttonFontStyle}
            />
            <Button onPress={()=>this.props.navigation.navigate('signupPage')}
            buttonStyle={[loginStyle.buttonsStyle,{backgroundColor:'#45546d'}]}
            title='Create an Account' titleStyle={loginStyle.buttonFontStyle}
            />
          </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

}




export default loginPage;
