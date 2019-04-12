import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,
  Text, View,Image,StyleSheet,KeyboardAvoidingView} from 'react-native';
import {NavigationEvents,NavigationActions,StackActions,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {Input,CheckBox,ThemeProvider,Button,Header} from 'react-native-elements';
import Autocomplete from 'react-native-autocomplete-input';
import {LinearGradient} from 'expo';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntIcon from 'react-native-vector-icons/Entypo'
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import * as Expo from 'expo'

import IP from '../constants/IP.js';

// const IP = "http://192.168.0.16"



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


class accountPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      notifications:false,
      userid:null,
      edit:false,
      username:null,
      location:null,
      email:null,
      profileID:null,
      predictions:[],
      tag:null,
      guest:this.props.navigation.getParam('guest',false),
    };
    // console.log(this.state.guest);
    if(this.state.guest){
      this.props.navigation.navigate('Account',{guest:true})
      this.props.navigation.navigate('Home')
      // console.log('here')
    }
    // console.log(Expo);
    this.getUserid();


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



  componentWillUnmount = () => {
    this.listener && this.listener.remove();
  }


  handleNotification = ({ origin, data }) => {
    // console.log(
    //   `Push notification ${origin} with data: ${JSON.stringify(data)}`
    // );
    this.props.navigation.navigate('notificationJobsPage',{notificationData:data.jobs})
  };



  // isNotificationActive = async () => {
  //   let url = IP+":3000/api/notifications/userID?q="+this.state.userid;
  //   await fetch(url)
  //   .then((response)=>response.json())
  //   .then((responseJson)=>{
  //       // console.log(responseJson)
  //       this.setState({notifications:responseJson.notification.length!=0})
  //       if(this.state.notifications){
  //         this.listener = Expo.Notifications.addListener(this.handleNotification);
  //       }
  //   })
  // }




  alertAllowNotifications = async () =>{
    return new Promise((resolve,reject)=>{
      Alert.alert(
        'Allow notifications',
        'Would you like to receive notifications of new jobs in your area?',
        [
          {text:'No', onPress:()=>{resolve('NO')}},
          {text:'Yes',onPress:async()=>{
            await this.getUserInfo();
            this.getToken();
            await AsyncStorage.setItem('notification', 'true');
            this.listener = Expo.Notifications.addListener(this.handleNotification);
            this.props.navigation.navigate('notificationPage')
            resolve('YES')
          }},
        ],
        {cancelable:false}
      )
    })
  }

  getUserid = async () => {
   try {
     const value = await AsyncStorage.getItem('userid');
     if (value !== null) {
       this.setState({userid:value})
     }
   } catch (error) {
     // Error retrieving data
   }
 };

 asyncAlert = async (logout) =>{
   return new Promise((resolve,reject)=>{
     Alert.alert(
       'Warning',
       logout?"You haven't saved your changes. Are you sure you want to sign out?":
       "You haven't saved your changes. Would you like to save?",
       [
         {text:'No', onPress:()=>{resolve(false)}},
         {text:'Yes',onPress:()=>{resolve(true)}},
       ],
       {cancelable:false}
     )
   })
 }

 callAlertLogout = async () => {
   await this.asyncAlert(true).then((response)=>{
     if(response){
       this._signOutAsync()
     }
   })
 }

 callAlertNavigate = async (dest) => {
   await this.asyncAlert(false).then((response)=>{
     if(response){
       this.editUserInfo()
     }
     this.setState({edit:false})
     this.props.navigation.navigate(dest)
   })
 }


  getUserInfo = async () =>{
    let url = IP+":3000/api/profiles/userID?q="+this.state.userid;
    await fetch(url)
    .then((response)=>response.json())
    .then((responseJson)=>{
        // console.log(responseJson)
        this.setState(state=>({username:responseJson.profile[0].username,
        email:responseJson.profile[0].email,location:responseJson.profile[0].location,
        profileID:responseJson.profile[0].id,tag:responseJson.profile[0].tag}));
    })
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


  editUserInfo = async () => {
    let url = IP+":3000/api/profiles/updateprofile";
    // console.log(this.state.userid)
    let editInfo = {
      userID:this.state.userid,
      profileID:this.state.profileID,
      username:this.state.username,
      email:this.state.email,
      location:this.state.location,
      tag:this.state.tag
    }
    try{
      let response = await fetch(url,{
        method:'PATCH',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(editInfo)
      });
      let responseJson = await response.json();
      // console.log(responseJson)
      if(responseJson.error!=undefined){
        alert("The email or username you have entered already exists. 💩")
        this.getUserInfo()
      }else{
        url = IP+":3000/api/notifications/updateNotification";
        let updatedInfo = {
          userID:this.state.userid,
          location:this.state.location.split(',')[0],
          tag:this.state.tag
        }
        let finalResponse = await fetch(url,{
          method:'POST',
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
          },
          body:JSON.stringify(updatedInfo)
        });
        responseJson = await finalResponse.json()
        console.log(responseJson)
      }
      return responseJson.result;
    }catch(error){
      console.log(error)
    }
  }

  allowNotifications = () =>{
      this.getToken();
      this.listener = Expo.Notifications.addListener(this.handleNotification);
  }

  unallowNotifications = async () =>{
    let url = IP+":3000/api/notifications/deleteuserID?q="+this.state.userid;
    await fetch(url)
    .then((response)=>response.json())
    .then((responseJson)=>{
        // console.log(responseJson)
    })
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.unallowNotifications()
    this.props.navigation.navigate('AuthLoading');
  };


  render() {
    return(
      <View style={{flex:1, height:'100%'}}>
        <NavigationEvents
        onDidFocus={payload=>{
          if(!this.state.edit && !this.state.guest){
            setTimeout(()=>{
              this.getUserInfo()
              // this.isNotificationActive()
            },1)
          }
        }}
        onWillBlur={payload=>{
          if(this.state.edit){
            this.props.navigation.navigate('accountPage')
            this.callAlertNavigate(payload.action.routeName)
          }
          this.setState({edit:false})
        }}
        />
      <Header
        barStyle="light-content"
        leftComponent={
        <Button onPress={()=>{
            this.getUserInfo()
            this.setState({edit:false})
        }}
        disabled={!this.state.edit} disabledStyle={{backgroundColor:'transparent'}} disabledTitleStyle={{color:'transparent'}}
        type='clear'  title='Cancel'/>
        }
        centerComponent={{text:'Account',style:{color:'black',fontWeight:'bold',fontSize:18}}}
        rightComponent={<Button icon={!this.state.edit?<EntIcon name='edit'color="#397af8" size={20}/>:<EntIcon name='save'color="#397af8" size={20}/>}
        onPress={()=>{
            if(this.state.edit){
              this.editUserInfo();
            }
            this.setState({edit:!this.state.edit})
        }}
        type='clear' title={!this.state.edit?'Edit':'Save'}/>}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'space-around',
        }}
      />
      <View style={{marginTop:7,height:'13%',shadowColor:'gray',shadowOpacity:1,shadowRadius:5
      ,flexDirection:'row',justifyContent:'space-evenly',
      alignItems:'center'}}>
        <View style={[{backgroundColor:'red'},styles.innerHeaderStyle]}></View>
        <View style={[{backgroundColor:'green'},styles.innerHeaderStyle]}></View>
        <View style={[{backgroundColor:'blue'},styles.innerHeaderStyle]}></View>
      </View>
      <View style={{ alignItems:'center',flexDirection:'column', justifyContent:'space-evenly',
      width:wp('100%'),height:hp('33%'),marginTop:10}}>
        <View style={{flexDirection:'column',zIndex:1}}>
          <Text style={{fontSize:21}}><MatIcon name='map-marker-radius' color='black' size={30}/>Looking for a <Text style={{fontWeight:'bold',color:'red'}}>J</Text><Text style={{fontWeight:'bold',color:'green'}}>O</Text><Text style={{fontWeight:'bold',color:'blue'}}>B</Text> in...</Text>
          <Autocomplete
             containerStyle={{width:wp('90%')}}
             autoCorrect={false}
             listStyle={{maxHeight:120}}
             onBlur={()=>this.setState({predictions:[]})}
             inputContainerStyle={{paddingLeft:5, borderColor:'gray',borderWidth:2}}
             returnKeyType={'done'}
             clearButtonMode={this.state.edit?'always':'never'}
             editable={this.state.edit}
             data={this.state.predictions}
             defaultValue={this.state.location}
             onChangeText={text => this.onChangeDestJOB(text)}
             placeholder='City, Province, Country'
             renderItem={({ loc }) => (
                <Text style={{padding:7}} onPress={() => this.setState({ location: loc,predictions:[] })}>
                  {loc}
                </Text>
              )}
            />
        </View>
        <Input
          returnKeyType={'done'}
          clearButtonMode={this.state.edit?'always':'never'}
          editable={this.state.edit}
          autoFocus={this.state.edit}
          onChangeText={(text) => this.setState({username:text})}
          value={this.state.username}
          containerStyle={{width:wp('90%')}} inputStyle={{padding:7}}
          leftIcon={<Icon name='user-circle' color='black' size={30}/>}
          placeholder='Username'
          />
        <Input
          returnKeyType={'done'}
          clearButtonMode={this.state.edit?'always':'never'}
          editable={this.state.edit}
          onChangeText={(text) => this.setState({email:text})}
          value={this.state.email}
          inputStyle={{padding:7}} containerStyle={{width:wp('90%')}}
          placeholder='example@email.com' leftIcon={<MatIcon name='email' color='black' size={30}/>}
          />
        <Input
          returnKeyType={'done'}
          clearButtonMode={this.state.edit?'always':'never'}
          editable={this.state.edit}
          onChangeText={(text) => this.setState({tag:text})}
          value={this.state.tag}
          inputStyle={{padding:7}} containerStyle={{width:wp('90%')}}
          placeholder='Example tag: Summer' leftIcon={<AntIcon name='tags' color="black" size={30}/>}
        />
      </View>
      <View style={{flexDirection:'row',height:hp('8%'),width:wp('93%'),justifyContent:'space-evenly',alignItems:'center'}}>
        <Button buttonStyle={{width:wp('45%')}} type='clear' title='Notifications'
        onPress={async ()=>{
          const permission = await AsyncStorage.getItem('notification')
          if(permission=='true'){
            this.props.navigation.navigate('notificationPage')
          }else{
            await this.alertAllowNotifications()
          }
        }}
        />
        <Button buttonStyle={{width:wp('45%')}} type="clear" title="Change Password"/>
      </View>
      <View style={{alignItems:'center',height:hp('15%'),width:wp('100%'),justifyContent:'center'}}>
        <Button buttonStyle={{width:wp('75%')}} type="outline"
        icon={<SLIcon name="logout" color="#397af8" size={33}/>}
        onPress={()=>{
        if(this.state.edit){
            this.callAlertLogout()
        }else{
            this._signOutAsync()
        }

        }}
        title='   Sign out'/>
      </View>

      </View>
    );
  }



}

export default accountPage;



const styles = StyleSheet.create({
  autocompleteContainer: {
    flexDirection:'column',
    marginTop:10,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  container:{
    flex:1,
    flexDirection:'column',
    alignItems:"center",
    justifyContent:"center",
  },
  entries:{
    height:hp('50%'),
    marginRight:'15%',
    marginLeft:'15%',
    flexDirection:'column',
    justifyContent:'space-evenly',
  },
  headerStyle:{
    // marginTop:'3%',
    // paddingTop:35,
    flexDirection: 'row',
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'space-evenly',
    flex:-1,
    flexWrap:'nowrap',
    width:'100%',
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
  row:{flex:1,
    lineHeight:15,
    paddingVertical:25,
    paddingHorizontal:15,
    flexDirection:'row',
    justifyContent:'space-evenly',
    borderBottomWidth:1,
    borderColor:'white'},
});
