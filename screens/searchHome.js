import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,
  Text, View,Image,StyleSheet,TouchableWithoutFeedback, Keyboard} from 'react-native';
import {NavigationEvents,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import helpers from '../globalFunctions.js';

import shortListPage from './shortlist.js';
import loginPage from './login.js';
import signupPage from './signup.js';
import Autocomplete from 'react-native-autocomplete-input';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import IP from '../constants/IP.js';


const cities = [
  {
      id:1,
      loc:"Toronto, ON",
  },
  {
    id:2,
    loc:"Oakville, ON",
  },
  {
      id:3,
      loc:"Mississauga, ON",
  },
  {
      id:4,
      loc:"Waterloo, ON",
  },
  {
    id:5,
    loc:"Guelph, ON",
  },
  {
    id:6,
    loc:"Windsor, ON",
  },
  {
    id:7,
    loc:"Stratford, ON",
  },
  {
    id:8,
    loc:"Kitchener, ON",
  }
]



class Home extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      userid:null,
      text: null,
      location:null,
      predictions:[],
      history:[],
      notificationData:[],

  };
  this.getUserid()

  }

  getUserid = async () => {
   try {
     const value = await AsyncStorage.getItem('userid');
     if (value !== null) {
       this.setState({userid:value})
       const permission = await AsyncStorage.getItem('notification')
       if(permission=='true'){
         this.listener = Expo.Notifications.addListener(this.handleNotification);
       }
     }
   } catch (error) {
     // Error retrieving data
   }
  };

  componentWillUnmount = () => {
    this.listener && this.listener.remove();
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

  getHistory = async (text) => {
    this.setState({text:text})
    let url = IP+":3000/api/search-histories/userID?q="+this.state.userid;
    await fetch(url)
    .then((response)=>response.json())
    .then((responseJson)=>{
      // console.log(responseJson.searchTerms[0].word)
      var history = []
      for(var i = 0;i<responseJson.searchTerms.length;i++){
        if(responseJson.searchTerms[i].word.toLowerCase().indexOf(text.toLowerCase())!=-1 && text!=''){
            history.push(responseJson.searchTerms[i])
        }
      }
      this.setState(state=>({history:history}));
      // console.log(this.state.history)
    })
  }

  handleNotification = ({ origin, data }) => {
    // console.log(data.jobs[0])

    // let correctData = JSON.parse(data)
    // console.log(correctData)
    // console.log(
    //   `Push notification ${origin} with data: ${JSON.stringify(data.jobs)}`
    // );
    // console.log(correctData[0])
    this.setState({notificationData:data.jobs})
    // console.log(this.state.notificationData)
    this.props.navigation.navigate('notificationJobsPage',{notification:this.state.notificationData})
  };

  // isNotificationActive = async () => {
  //   let url = IP+":3000/api/notifications/userID?q="+this.state.userid;
  //   await fetch(url)
  //   .then((response)=>response.json())
  //   .then((responseJson)=>{
  //       if(responseJson.notification.length!=0){
  //         this.listener = Expo.Notifications.addListener(this.handleNotification);
  //       }
  //   })
  // }

  render() {
    return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <View style={styles.headerStyle}>
         <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'red',width:50,height:50,borderRadius:7}}>
           <Text style={{color:'white', fontSize:33,fontWeight:'bold'}}>J</Text>
         </View>
         <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'green',width:50,height:50,borderRadius:7}}>
           <Text style={{color:'white',fontSize:33,fontWeight:'bold'}}>O</Text>
         </View>
         <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'blue',width:50,height:50,borderRadius:7}}>
             <Text style={{color:'white',fontSize:33,fontWeight:'bold'}}>B</Text>
         </View>
      </View>
      <View style={{width:wp('100%'),margin:'3%',flexDirection:'row',justifyContent:'space-evenly'}}>
        <Autocomplete
         onBlur={()=>this.setState({predictions:[]})}
         containerStyle={{borderWidth:2,borderColor:'gray',borderRadius:7,width:wp('39%'),height:45}}
         style={{paddingHorizontal:7,paddingVertical:12,backgroundColor:'transparent',borderColor:'transparent'}}
         listContainerStyle={{backgroundColor:'white',borderRadius:7}}
         listStyle={{backgroundColor:'white',borderRadius:7,maxHeight:120}}
         autoCorrect={false}
         inputContainerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
         returnKeyType={'next'}
         clearButtonMode={'while-editing'}
         data={this.state.predictions}
         defaultValue={this.state.location}
         onChangeText={text => this.onChangeDestJOB(text)}
         onSubmitEditing={()=>this.searchInput.focus()}
         placeholder='Enter location📍'
         renderItem={({ loc }) => (
            <Text style={{padding:7}} onPress={() => this.setState({ location: loc,predictions:[] })}>
              {loc}
            </Text>
          )}
        />
        <Autocomplete
        containerStyle={{borderWidth:2,borderColor:'gray',borderRadius:7,width:wp('39%'),height:45}}
        style={{paddingHorizontal:7,paddingVertical:12,backgroundColor:'transparent',borderColor:'transparent'}}
        listContainerStyle={{backgroundColor:'white',borderRadius:7}}
        listStyle={{backgroundColor:'white',borderRadius:7,maxHeight:120}}
        onBlur={()=>this.setState({history:[]})}
        autoCorrect={false}
        inputContainerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
        ref={(input)=>{this.searchInput = input}}
        clearButtonMode='while-editing'
        placeholder='Search position!'
        onChangeText={(text) => this.getHistory(text)}
        returnKeyType={'search'}
        onSubmitEditing={()=>{
          if(this.state.text==undefined || this.state.text.length==0){
            alert('Invalid Input. Please fill the entry.');
          }else{
            this.props.navigation.push('findPage',{searchKey:this.state.text});
            this.setState({text:''});
        }
        }}
        data={this.state.history}
        defaultValue={this.state.text}
        renderItem={({ word }) => (
           <Text style={{padding:7,color:'purple'}} onPress={() => this.setState({ text: word,history:[] })}>
             {word}
           </Text>
         )}
        />
        <Button
        onPress={()=>{
          // console.log(this.state.location)
          if((this.state.text==null || this.state.text.length==0||this.state.text==null)&&(this.state.location==null || this.state.location.length==0)){
            alert('Invalid Input. Please fill the entry.');
          }else{
            this.props.navigation.push('findPage',{searchKey:this.state.text,location:this.state.location});
            this.setState({text:''});
        }
          }}
        title='Find'
        buttonStyle={{height:45,width:wp("12%")}}
        // icon={<Icon name='safari' size={20} color='lightgray'/>}
        // iconRight
        type='clear'
        />
      </View>

    </View>
  </TouchableWithoutFeedback>
    );
  }
}

export default Home;

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
    borderBottomWidth:2,
    borderColor:'gray'
  },
  innerHeaderStyle:{
    // marginHorizontal:'2%',
    width:38,
    height:38,
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
    padding:8,
    color:'white',
    fontSize:24,
    fontWeight:'bold',
    width:'100%',
    paddingTop:5,
    paddingBottom:5,
    borderRadius:7,
    overflow:'hidden'
  },
  jobTitleActually:{
    flex:1,
    flexDirection:'row',
    width:'100%',
    padding:5,
    borderRadius:7,
    paddingTop: 10
  },
  jobInfo:{
    margin:12
  },
  jobInfoText:{
    fontSize:14,
  },


});
