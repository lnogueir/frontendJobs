import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Switch,
  Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,
  ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {NavigationEvents,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import IP from '../constants/IP.js';


class notificationPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      locationNoti:{id:null,status:false},
      shortlistNoti:{id:null,status:false},
      tagNoti:{id:null,status:false},
    }
    this.getUserid()
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft:<Button style={{width:wp('24%')}} onPress={()=>navigation.navigate('accountPage')} title=' Account' type='clear' icon={<Icon name='chevron-left' color='#397af8' size={20}/>}/>,
      headerRight:<Image
        style={{width:40,height:46}}
        source={require('../assets/PlanetJobLogo.png')}
      />
    }
  }


  getUserid = async () => {
   try {
     const value = await AsyncStorage.getItem('userid');
     if (value !== null) {
       this.setState({userid:value})
       this.isNotificationActive();
     }
   } catch (error) {
     // Error retrieving data
   }
  };

  isNotificationActive = async () => {
    let url = IP+":3000/api/notifications/userID?q="+this.state.userid;
    await fetch(url)
    .then((response)=>response.json())
    .then((responseJson)=>{
        // console.log(responseJson/*.notification[0].notificationType*/)
        for(var i=0;i<responseJson.notification.length;i++){
          if(responseJson.notification[i].notificationType=='location'){
            this.setState({locationNoti:{id:responseJson.notification[i].id,status:responseJson.notification[i].enabled}})
          }
          if(responseJson.notification[i].notificationType=='generic'){
              this.setState({tagNoti:{id:responseJson.notification[i].id,status:responseJson.notification[i].enabled}})
          }
          if(responseJson.notification[i].notificationType=='shortlist'){
            this.setState({shortlistNoti:{id:responseJson.notification[i].id,status:responseJson.notification[i].enabled}})
          }

        }
        // if(this.state.notifications){
        //   this.listener = Expo.Notifications.addListener(this.handleNotification);
        // }
    })
  }

  changeNotificationStatus = async (notificationType) => {
    let url = IP+":3000/api/notifications/"+notificationType.id;
    let editInfo = {
      enabled:!notificationType.status
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
      return responseJson.result;
    }catch(error){
      console.log(error)
    }
  }




  render(){
    return(
    <View style={styles.container}>
    <LinearGradient
      colors={['rgba(0,0,0,0.04)','rgba(0,0,0,0)']}
      start={[0,0.5]}
    >
      <View style={{flexDirection:'column',height:hp('40%')}}>
          <View style={styles.row}>
            <MatIcon style={{lineHeight:40}} name='location-on' color="#1968e8" size={42}/>
            <Text style={styles.textStyle}>New jobs in my area</Text>
            <Switch style={styles.switchStyle}
            onValueChange={async()=>{
              await this.changeNotificationStatus(this.state.locationNoti);
              this.setState({locationNoti:{id:this.state.locationNoti.id,status:!this.state.locationNoti.status}})
            }}
            value={this.state.locationNoti.status}
            />
          </View>
          <View style={styles.row}>
            <MatIcon style={{lineHeight:40}} name='search' color="#45546d" size={42}/>
            <Text style={styles.textStyle}>New jobs with my tags</Text>
            <Switch
            style={styles.switchStyle}
            onValueChange={async()=>{
              await this.changeNotificationStatus(this.state.tagNoti);
              this.setState({tagNoti:{id:this.state.tagNoti.id,status:!this.state.tagNoti.status}})
            }}
            value={this.state.tagNoti.status}
            />
          </View>
          <View style={styles.row}>
            <MatIcon style={{lineHeight:40}} name="bookmark" color="black" size={42}/>
            <Text style={styles.textStyle}>Shortlist deadlines</Text>
            <Switch
            style={styles.switchStyle}
            onValueChange={async()=>{
              await this.changeNotificationStatus(this.state.shortlistNoti);
              this.setState({shortlistNoti:{id:this.state.shortlistNoti.id,status:!this.state.shortlistNoti.status}})
            }}
            value={this.state.shortlistNoti.status}
            />
          </View>
        </View>
      </LinearGradient>
    </View>


    )
  }


}


export default notificationPage;



const styles = StyleSheet.create({
  row:{flex:1,
    paddingVertical:25,
    paddingHorizontal:15,
    flexDirection:'row',
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderColor:'white'},
  textStyle:{
    fontSize:17,
    lineHeight:40,
    fontFamily:Platform.OS=='ios'?'Avenir':'Nunito'
  },
  switchStyle:{
    lineHeight:40,
  },
  container: {backgroundColor:'#fff',
  // justifyContent:'center',
  // alignItems:'center',
  flex:1,
  }
})
