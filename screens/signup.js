import React, {Component} from 'react';
import {TextInput,Alert, KeyboardAvoidingView,
  TouchableWithoutFeedback,Keyboard,Text, View,Image} from 'react-native';
import {Input,Button,Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Autocomplete from 'react-native-autocomplete-input';
import IP from '../constants/IP.js';
import createAccount from '../styles/createAccountStyle.js'

const cities = [
  {
      id:1,
      loc:"Toronto, Ontario, CA",
  },
  {
    id:2,
    loc:"Oakville, Ontario, CA",
  },
  {
      id:3,
      loc:"Mississauga, Ontario, CA",
  },
  {
      id:4,
      loc:"Waterloo, Ontario, CA",
  },
  {
    id:5,
    loc:"Guelph, Ontario, CA",
  },
  {
    id:6,
    loc:"Windsor, Ontario, CA",
  },
  {
    id:7,
    loc:"Stratford, Ontario, CA",
  },
  {
    id:8,
    loc:"Kitchener, Ontario, CA",
  }
]


class signupPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username:null,
      checked:false,
      password:null,
      email:null,
      location:null,
      predictions:[]
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Create Account',
      headerRight:<Image
          style={{width:40,height:46}}
          source={require('../assets/PlanetJobLogo.png')}
        />
    }
  }




  createProfile = async (userid) =>{
    this.setState({userid:userid})
    // console.log(this.state.userid)
    let userData = {
      userID:userid,
      username:this.state.username,
      email:this.state.email,
      location:this.state.location
    }
    var url = IP+':3000/api/profiles'
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
    // console.log(responseJson)
    return responseJson.result
  }catch(error){
    console.log(error)
  }
}


searchCities = (input) =>{
let predictions = []
for(var i = 0;i<cities.length;i++){
  if(cities[i].loc.toLowerCase().indexOf(input.toLowerCase())!=-1 && input!=''){
      predictions.push(cities[i])
  }
}
return predictions;
}

  onChangeDestJOB = (loc) =>{
    this.setState({location:loc})
    this.setState({predictions:this.searchCities(loc)})
  }


  asyncAlert = async () =>{
    return new Promise((resolve,reject)=>{
      Alert.alert(
        'Congratulations!' ,
        'Your account has been successfully created. You are ready to get HIRED!',
        [
          {text:'Ok',onPress:()=>{resolve('YES')}},
          // {text:'No', onPress:()=>{resolve('NO')}},
        ],
        {cancelable:false}
      )
    })
  }




  createAccount = async () =>{
    let userData = {
       username:this.state.username,
       password:this.state.password,
       email:this.state.email
       // location:this.state.location
     }
     var url = IP+':3000/api/Users'
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
       // console.log(responseJson)
       if(responseJson.error == undefined){
         this.createProfile(responseJson.id)
         await this.asyncAlert()
         // await alert('Congratulations! 🥳  Your account has been successfully created. You are ready to get HIRED!')
         this.props.navigation.goBack()
       }
       else{
         alert("The email or username you have entered already exists. 💩")

       }
       return responseJson.result;
     }catch(error){
       console.log(error)
     }
}


  render(){
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={createAccount.container}>
          <View style={createAccount.inputView}>
            <Input
              onSubmitEditing={()=>this.emailInput.focus()}
              returnKeyType={'next'}
              blurOnSubmit={false}
              clearButtonMode='while-editing'
              onChangeText={(text) => this.setState({username:text})}
              value={this.state.username}
              inputStyle={createAccount.inputStyle}
              containerStyle={createAccount.containerStyle}
              leftIcon={<MatIcon name='account-circle' color='#45546d' size={32}/>}
              placeholder='Username'
              placeholderTextColor='#45546d'
            />
            <Input
              ref={(input)=>{this.emailInput = input}}
              returnKeyType={'next'}
              clearButtonMode='while-editing'
              keyboardType='email-address'
              onSubmitEditing={()=>this.passwordInput.focus()}
              blurOnSubmit={false}
              onChangeText={(text) => this.setState({email:text})}
              value={this.state.email}
              autoCorrect={false}
              inputStyle={createAccount.inputStyle}
              containerStyle={createAccount.containerStyle}
              leftIcon={<MatIcon name='mail' color='#45546d' size={32}/>}
              placeholder='example@email.com'
              placeholderTextColor='#45546d'
            />
            <Input
              inputStyle={createAccount.inputStyle}
              containerStyle={createAccount.containerStyle}
              leftIcon={<MatIcon name='lock' color='#45546d' size={32}/>}
              rightIcon={<Icon raised onPress={()=>this.setState({checked:!this.state.checked})}
              name={this.state.checked?'eye-slash':'eye'} color='#45546d' size={32}/>}
              placeholder='Password'
              placeholderTextColor='#45546d'
              ref={(input)=>{this.passwordInput = input}}
              returnKeyType={'next'}
              autoCorrect={false}
              clearButtonMode='while-editing'
              secureTextEntry={!this.state.checked}
              onChangeText={(text) => this.setState({password:text})}
              value={this.state.password}
              onSubmitEditing={()=>this.locationInput.focus()}
              blurOnSubmit={false}
            />
            <Input
              inputStyle={createAccount.inputStyle}
              containerStyle={createAccount.containerStyle}
              leftIcon={<MatIcon name='location-on' color='#45546d' size={32}/>}
              placeholder='City, Province'
              placeholderTextColor='#45546d'
              ref={(input)=>{this.locationInput = input}}
              returnKeyType={'done'}
              clearButtonMode='while-editing'
              autoCorrect={false}
              onBlur={()=>this.setState({predictions:[]})}
              returnKeyType={'done'}
              onChangeText={text => this.onChangeDestJOB(text)}
              placeholder='City, Province, Country'
            />
          </View>
          <View style={createAccount.buttonViewLogin}>
            <Button onPress={()=>this.createAccount()}
            buttonStyle={[createAccount.buttonsStyle,{backgroundColor:'#1968e8'}]}
            title='Sign Up' titleStyle={createAccount.buttonFontStyle}
            />
          </View>
      </View>
    </TouchableWithoutFeedback>
    );

  }




}





export default signupPage;
