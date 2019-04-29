import React, {Component} from 'react';
import {Platform,AsyncStorage, TextInput,Alert,ScrollView,
Text, View,Image,KeyboardAvoidingView,TouchableOpacity} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Overlay,ListItem,Input,Button,Header} from 'react-native-elements';
import Autocomplete from 'react-native-autocomplete-input';
import MatCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Tags from "react-native-tags";
import IP from '../constants/IP.js';
import accountStyle from '../styles/accountStyle.js'




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
    tagArray=[]
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
      isVisible:false,
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
      // console.log(responseJson)
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
       this.getUserInfo()
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
        this.tagArray = this.state.tag.split(',')
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
    console.log(this.tagArray)
    let editInfo = {
      userID:this.state.userid,
      profileID:this.state.profileID,
      username:this.state.username,
      email:this.state.email,
      location:this.state.location,
      tag:this.tagArray.join(',')
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
          tag:null
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
        this.getUserInfo()
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
    <KeyboardAvoidingView style={{flex:1,justifyContent:'flex-end'}} behavior="padding" enabled>
      <View style={accountStyle.container}>
        <NavigationEvents
          onDidFocus={payload=>{
            if(this.state.userid && !this.state.edit && !this.state.guest){
                this.getUserInfo()
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
        <Overlay
            isVisible={this.state.isVisible}
            width='70%'
            height='38%'
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            onBackdropPress={() => {
              this.editUserInfo()
              this.setState({ isVisible: false })
            }}
            overlayBackgroundColor="#45546d"
          >
          <View stlye={{margin:10,justifyContent:'center',alignItems:'center'}}>
            <Text style={accountStyle.overlayTitle}>Your tags:</Text>
            <Tags
              containerStyle={{margin:10}}
              textInputProps={{
                 containerStyle:{borderRadius:20},
                 autoFocus:true,
                 returnKeyType:'done',
                 onSubmitEditing:()=>{
                   this.editUserInfo()
                   this.setState({ isVisible: false })
                 }
               }}
               initialTags={this.state.tag?this.state.tag.split(','):[]}
               onChangeTags={tags => {
                 this.tagArray = tags
               }}
               maxNumberOfTags={15}
               deleteTagOnPress={true}
               containerStyle={{ justifyContent: "center" }}
               inputStyle={{ backgroundColor: "lightgray" }}
            />
          </View>
        </Overlay>
        <Header
          backgroundColor='transparent'
          leftComponent={this.state.edit?<Button onPress={()=>{
            this.getUserInfo()
            this.setState({edit:false})
        }}
        disabled={!this.state.edit} disabledStyle={{backgroundColor:'transparent'}} disabledTitleStyle={{color:'transparent'}}
        type='clear'  title='Cancel'/>
        :<Image
            style={{width:40,height:46}}
            source={require('../assets/PlanetJobLogo.png')}
          />}
          centerComponent={{text:'Profile',style:accountStyle.headerFontStyle}}
          rightComponent={<Button onPress={()=>{
            if(this.state.edit){
              this.editUserInfo();
            }
            this.setState({edit:!this.state.edit})

          }}
          type='clear' icon={!this.state.edit?<Icon name='edit' color='#1968e8' size={32}/>:<MatIcon name='save' color='#1968e8' size={32}/>}/>}
        />
          <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={accountStyle.profileInfoView}>
              <Text style={accountStyle.accountInfoTitle}>Account Information</Text>
              <Input
                returnKeyType={'done'}
                clearButtonMode={this.state.edit?'always':'never'}
                editable={this.state.edit}
                autoFocus={this.state.edit}
                onChangeText={(text) => this.setState({username:text})}
                value={this.state.username}
                inputStyle={accountStyle.inputStyle}
                containerStyle={accountStyle.containerStyle}
                leftIcon={<MatIcon name='account-circle' color='#45546d' size={34}/>}
                placeholder='Username'
                placeholderTextColor='#45546d'
              />
              <Input
                returnKeyType={'done'}
                clearButtonMode={this.state.edit?'always':'never'}
                editable={this.state.edit}
                onChangeText={(text) => this.setState({email:text})}
                value={this.state.email}
                inputStyle={accountStyle.inputStyle}
                containerStyle={accountStyle.containerStyle}
                leftIcon={<MatIcon name='mail' color='#45546d' size={34}/>}
                placeholder='example@email.com'
                placeholderTextColor='#45546d'
              />
              <Button onPress={()=>this.props.navigation.navigate('changePassword',{userid:this.state.userid})}
              buttonStyle={[accountStyle.buttonStyle,{backgroundColor:'#45546d'}]}
              title='CHANGE PASSWORD' titleStyle={accountStyle.buttonTitleStyle}
              />
            </View>
            <View style={accountStyle.profileInfoView}>
              <Text style={accountStyle.accountInfoTitle}>Notifications</Text>
              <View style={{zIndex:1}}>
                <MatIcon style={accountStyle.icon} name='location-on' color='#45546d' size={34}/>
                <Autocomplete
                 returnKeyType={'done'}
                 onBlur={()=>this.setState({predictions:[]})}
                 editable={this.state.edit}
                 style={accountStyle.input}
                 listContainerStyle={accountStyle.outsideInput}
                 listStyle={{maxHeight:120}}
                 autoCorrect={false}
                 inputContainerStyle={{borderColor:'transparent'}}
                 clearButtonMode={this.state.edit?'always':'never'}
                 data={this.state.predictions}
                 defaultValue={this.state.location}
                 onChangeText={text => this.onChangeDestJOB(text)}
                 underlineColorAndroid='transparent'
                 placeholder='Where?'
                 renderItem={({ loc }) => (
                    <Text style={accountStyle.textIn} onPress={() => this.setState({ location: loc,predictions:[] })}>
                      {loc}
                    </Text>
                  )}
              />
              </View>
              <ListItem
                style={accountStyle.listItemStyle}
                containerStyle={{borderBottomWidth:1,borderColor:'gray'}}
                leftIcon={<AntIcon name='tags' color='#45546d' size={30}/>}
                onPress = {()=>this.setState({isVisible:true})}
                rightIcon={<AntIcon name='right' color='gray' size={25}/>}
                title={'Tags'}
                titleStyle={accountStyle.listItemTitle}
                badge={{ value:this.state.tag?this.state.tag.split(',').length:0, badgeStyle:{width:50,height:30,backgroundColor:'#45546d',borderRadius:50}}}
                // subtitle={l}
                // subtitleStyle={{fontSize:14,color:'gray'}}
              />
              <Button buttonStyle={[accountStyle.buttonStyle,{backgroundColor:'blue'}]}
              title='VIEW NOTIFICATIONS' titleStyle={accountStyle.buttonTitleStyle}
              onPress={async ()=>{
                const permission = await AsyncStorage.getItem('notification')
                if(permission=='true'){
                  this.props.navigation.navigate('notificationPage')
                }else{
                  await this.alertAllowNotifications()
                }
              }}
              />
            </View>
            <View style={accountStyle.logoutView}>
              <Button
              onPress={()=>{
                if(this.state.edit){
                    this.callAlertLogout()
                }else{
                    this._signOutAsync()
                }
              }}
              buttonStyle={[accountStyle.buttonStyle,{backgroundColor:'lightcoral',width:200,height:50}]}
              title='Logout'
              titleStyle={accountStyle.buttonTitleStyle}
              icon={<MatCIcon name="logout-variant" color="white" size={30}/>}
              />
            </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
    );
  }



}

export default accountPage;
