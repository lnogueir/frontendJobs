import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,
  TouchableWithoutFeedback,Keyboard,
  Linking,TouchableHighlight,TouchableOpacity
  ,FlatList,AppRegistry,KeyboardAvoidingView,
  ScrollView,Text,View,Image,StyleSheet} from 'react-native';
import {NavigationActions,StackActions,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {Divider,CheckBox,ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import helpers from '../globalFunctions.js';
import signupPage from './signup.js';
import IP from '../constants/IP.js';

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
      title: 'Authentication'
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
    <KeyboardAvoidingView behavior='padding' style={{justifyContent:'flex-end'}}>
      <View style={{flexDirection:'column',justifyContent:'space-between'}}>
        <View style={{alignItems:'center',justifyContent:'center',marginVertical:'10%'}}>
          <View style={styles.headerStyle}>
           <View style={[styles.innerHeaderStyle,{backgroundColor:'red'}]}>
             <Text style={{color:'white', fontSize:35,fontWeight:'bold'}}>J</Text>
           </View>
           <View style={[styles.innerHeaderStyle,{backgroundColor:'green'}]}>
             <Text style={{color:'white',fontSize:35,fontWeight:'bold'}}>O</Text>
           </View>
           <View style={[styles.innerHeaderStyle,{backgroundColor:'blue'}]}>
              <Text style={{color:'white',fontSize:35,fontWeight:'bold'}}>B</Text>
           </View>
          </View>
        </View>
        <View style={{alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:23}}> Login to <Text style={{fontWeight:'bold',color:'red'}}>J</Text><Text style={{fontWeight:'bold',color:'green'}}>O</Text><Text style={{fontWeight:'bold',color:'blue'}}>B</Text> and get hired! </Text>
        </View>
        <View style={styles.login}>
          <TextInput
          returnKeyType={'next'}
          clearButtonMode='while-editing'
          style={{height:45,borderBottomWidth:2,borderColor:'gray',width:270,padding:7}}
          placeholder='Username'
          onChangeText={(text) => this.setState({username:text})}
          value={this.state.username}
          onSubmitEditing={()=>this.passwordInput.focus()}
          blurOnSubmit={false}
          />
          <TextInput
          returnKeyType={'go'}
          onSubmitEditing={()=>this.handleLogin()}
          ref={(input)=>{this.passwordInput = input}}
          clearButtonMode='while-editing'
          secureTextEntry={true}
          style={{height:45,borderBottomWidth:2,borderColor:'gray',width:270,padding:7}}
          placeholder='Password'
          onChangeText={(text) => this.setState({password:text})}
          value={this.state.password}
          />
        </View>
          <View style={{width:'100%',justifyContent:'center',flexDirection:'row'}}>
            <Button titleStyle={{fontSize:20}} style={{lineHeight:15}} type='clear' title='Forgot password?'/>
            <Button titleStyle={{fontSize:20}} style={{lineHeight:15}} iconRight type='clear' icon={<AntIcon name='login' color='#397af8' size={26}/>}
            title='Sign In    '
            onPress={()=>{this.handleLogin()}}/>
          </View>
          <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
            <Text></Text>
          </View>

          <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'red'}}>{this.state.error}</Text>
          </View>


          <Button buttonStyle={{margin:15}} onPress={() => {this.props.navigation.navigate('signupPage')}} icon={
            <Icon
              name='user-circle'
              size={25}
              color='white'
              />
          }
            style={{marginTop:'9%'}} title='  Create account'
            />
            <Text style={{alignSelf:'center',color:'gray',fontSize:23}}>──────  Or  ──────</Text>
            <Button onPress={()=>{this.props.navigation.navigate('accountPage',{guest:true})}} buttonStyle={{margin:15}} title="Enter as Guest" type="outline"/>


      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

}




export default loginPage;


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
    // marginHorizontal:'2%',
    width:60,
    height:60,
    borderRadius:7,
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
    // fontFamily:Platform.OS==='ios'?'Avenir':'Nunito',
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
