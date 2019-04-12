import React, {Component} from 'react';
import {Platform,ActivityIndicator, TextInput,Alert,Linking, KeyboardAvoidingView,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,TouchableWithoutFeedback,
  Keyboard,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header,CheckBox} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import helpers from '../globalFunctions.js';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Autocomplete from 'react-native-autocomplete-input';
import * as Expo from 'expo'
import IP from '../constants/IP.js';
import {Font} from 'expo';
// const IP = "http://192.168.0.16"
// const IP = "http://172.20.10.6"

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
      title: 'Create Account'
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
      <View style={{flex:1,height:'100%'}}>
        <View style={{height:'20%',shadowColor:'gray',shadowOpacity:1,shadowRadius:5
        ,flexDirection:'row',justifyContent:'space-evenly',
        alignItems:'center'}}>
          <View style={[{backgroundColor:'red'},styles.innerHeaderStyle]}></View>
          <View style={[{backgroundColor:'green'},styles.innerHeaderStyle]}></View>
          <View style={[{backgroundColor:'blue'},styles.innerHeaderStyle]}></View>
        </View>

        <View style={{alignItems:'center',justifyContent:'space-evenly', width:'100%',flexDirection:'row'}}>
          <Text style={{fontSize:23,width:wp('40%')}}><Icon name='user-circle' color='black' size={30}/> Username:</Text>
          <Text style={{fontSize:23, width:wp('40%')}}><MatIcon name='email' color='black' size={30}/> Email:</Text>
        </View>
        <View style={{marginVertical:8,alignItems:'center',justifyContent:'space-evenly',width:'100%',flexDirection:'row'}}>
          <TextInput
            onSubmitEditing={()=>this.emailInput.focus()}
            returnKeyType={'next'}
            blurOnSubmit={false}
            clearButtonMode='while-editing'
            style={{height:40,borderWidth:2,borderColor:'gray',
            width:wp('44%'),padding:10,borderRadius:20}}
            placeholder='Username'
            onChangeText={(text) => this.setState({username:text})}
            value={this.state.username}
            />
          <TextInput
           ref={(input)=>{this.emailInput = input}}
           returnKeyType={'next'}
           clearButtonMode='while-editing'
           style={{height:40,borderWidth:2,borderColor:'gray',
           width:wp('44%'),padding:10,borderRadius:20}}
           placeholder='example@email.com'
           keyboardType='email-address'
           onSubmitEditing={()=>this.passwordInput.focus()}
           blurOnSubmit={false}
           onChangeText={(text) => this.setState({email:text})}
           value={this.state.email}
           />
        </View>
        <View style={{marginVertical:8,alignItems:'center',justifyContent:'space-evenly', width:'100%',flexDirection:'row'}}>
          <Text style={{fontSize:23,width:wp('40%')}}><Icon name='lock' color='black' size={30}/> Password:</Text>
          <Text style={{width:wp('40%'),fontSize:23}}><MatIcon name='map-marker-radius' color='black' size={30}/> Job City:</Text>
        </View>
        <View style={{alignItems:'center',justifyContent:'space-evenly',width:'100%',flexDirection:'row'}}>
          <TextInput
             ref={(input)=>{this.passwordInput = input}}
             returnKeyType={'next'}
             clearButtonMode='while-editing'
             secureTextEntry={!this.state.checked}
             style={{height:40,borderWidth:2,borderColor:'gray',
             width:wp('44%'),padding:10,borderRadius:20}}
             placeholder='Password'
             onChangeText={(text) => this.setState({password:text})}
             value={this.state.password}
             onSubmitEditing={()=>this.locationInput.focus()}
             blurOnSubmit={false}
             />
            <Autocomplete
               ref={(input)=>{this.locationInput = input}}
               returnKeyType={'done'}
               clearButtonMode='while-editing'
               containerStyle={{borderWidth:2,borderColor:'gray',borderRadius:20,width:wp('44%'),height:40}}
               autoCorrect={false}
               style={{padding:10,backgroundColor:'transparent',borderColor:'transparent'}}
               inputContainerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
               listContainerStyle={{backgroundColor:'white',borderRadius:20}}
               listStyle={{backgroundColor:'white',borderRadius:20,maxHeight:95}}
               onBlur={()=>this.setState({predictions:[]})}
               returnKeyType={'done'}
               clearButtonMode={this.state.edit?'always':'never'}
               editable={this.state.edit}
               data={this.state.predictions}
               defaultValue={this.state.location}
               onChangeText={text => this.onChangeDestJOB(text)}
               placeholder='City, Province, Country'
               renderItem={({ loc }) => (
                 <TouchableOpacity onPress={() => this.setState({ location: loc,predictions:[] })}>
                  <Text style={{padding:7}}>
                    {loc}
                  </Text>
                </TouchableOpacity>
                )}
              />
        </View>
        <View style={{marginLeft:5, width:wp('50%')}}>
          <CheckBox
           containerStyle={{borderRadius:24,width:wp('45%')}}
           checkedIcon='dot-circle-o'
           uncheckedIcon='circle-o'
           onPress={()=>this.setState({checked:!this.state.checked})}
           title='Show my password' checked={this.state.checked}
            />
        </View>
        <Button onPress={() => {this.createAccount()} } style={{width:wp('40%'),alignSelf:'center',marginVertical:'11%'}} type='outline' title='Sign Up'/>
      </View>
      </TouchableWithoutFeedback>
    );

  }




}





export default signupPage;




















const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column',
    backgroundColor:"white",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    alignItems:"center",
    justifyContent:"center",
  },
  login:{
    alignItems:'center',
    justifyContent: 'space-evenly',
    marginTop:'4%'
  },
  headerStyle:{
    marginTop:'3%',
    paddingTop:35,
    flexDirection: 'row',
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'space-evenly',
    flex:-1,
    flexWrap:'nowrap',
    width:'100%',
    shadowColor:'gray',
    shadowOpacity:1,
    shadowRadius:5,
  },
  innerHeaderStyle:{
    marginHorizontal:'4%',
    width:50,
    height:50,
    borderRadius:0,
    alignItems:'center',
    justifyContent:'center',
  },
  col:{
    flex:1,
    paddingVertical:10,
    paddingHorizontal:15,
    flexDirection:'column',
    justifyContent:'space-between',
    borderBottomWidth:6,
    borderColor:'white',
    shadowOpacity:0

  },
  jobTitle:{
    padding:10,
    color:'white',
    fontSize:22,
    fontWeight:'bold',
    width:'100%',
    paddingTop:5,
    paddingBottom:5,
    borderRadius:7,
    overflow:'hidden'
  },
  jobInfo:{
    margin:12
  },
  jobInfoText:{
    fontSize:14,
  },



});
