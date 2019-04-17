import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,
  Text, View,Image,StyleSheet,KeyboardAvoidingView} from 'react-native';
import {NavigationEvents,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MatIcon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import helpers from '../globalFunctions.js';

import shortListPage from './shortlist.js';
import loginPage from './login.js';
import signupPage from './signup.js';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

import IP from '../constants/IP.js';
// const IP = "http://192.168.0.16"



class expandJob extends React.Component{
  constructor(props){
    super(props);
    this.state={
      userid:this.props.navigation.getParam('userid','Invalid userid'),
      job:this.props.navigation.getParam('job','Invalid job'),
      shortlist:{},
      guest:null,
      // displayFooter:this.props.navigation.getParam('display','Invalid display'),
    };

    this.isGuest()
    setTimeout(()=>{
      if(!this.state.guest){
        this.populateShortlist()
      }
      this.getDaysPosted()
    },1)


    //HOW TO DEAL WITH DATES:
    // var date1 = new Date('December 27, 1999 23:15:00'); //Current Date
    // var date2 = new Date('December 25, 1999 23:15:00'); //Current Date
    // var curDate = new Date(Date())
    // var jobDate = new Date('Tue Apr 02 2019 23:00:42 GMT-0400 (Eastern Daylight Time)')
    // var jobDate2 = new Date(this.state.job.date_post)
    // console.log(jobDate2)
    // console.log(curDate)
    // // console.log(Date())
    // console.log(Math.floor((curDate - jobDate2)/(1000*60*60*24)))
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Job Page',
    }
  }

  isGuest = async () => {
    try {
      const value = await AsyncStorage.getItem('userid');
      // console.log(value==null);
      this.setState({guest:value==null})
    } catch (error) {
      // Error retrieving data
    }
  }


  getDaysPosted = () => {

    var curDate = new Date(Date())
    var postedDate = new Date(this.state.job.date_post)
    var days = (curDate - postedDate)/(1000*60*60*24);
    // console.log(days)
    return days
  }

  componentDidMount = () => {
    this._isMounted = true
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  populateShortlist = async () => {
    let url = IP+':3000/api/Shortlists/userID?q='+this.state.userid;
    await fetch(url)
    .then((response)=>response.json())
    .then((responseJson)=>{
        let url = IP+':3000/api/job-posts/jobsArray'
        try{
            this.timer = fetch(url,{
            method:'POST',
            headers:{
              'Accept':'application/json',
              'Content-Type':'application/json',
            },
            body:JSON.stringify(responseJson.jobsforUserID)
          }).then((jobResponse)=>jobResponse.json())
            .then((finalResponse)=>{
              if(this._isMounted){
                let tempDic={}
                for(var i=0;i<finalResponse.jobs.length;i++){
                  // console.log(finalResponse.jobs[i])
                  tempDic[finalResponse.jobs[i][0].id]= finalResponse.jobs[i][0].id
                }
                this.setState({shortlist:tempDic})
                // this.setState({shortlist:finalResponse.jobs})
               }
              // console.log(this.state.shortlist[0][0].title)
            })
          return responseJson.result;
        }catch(error){
          console.log(error)
        }
      }
    );
  }

  toShortlist = async (jobId) => {
    let userData = {
       jobID:jobId,
       userID:this.state.userid
     }
     var url = IP+':3000/api/Shortlists/addShortList'
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
       if(responseJson.error!=undefined){
         alert("Sorry, something went wrong")
       }else{
         let tempDic = {}
         tempDic[jobId] = jobId
         this.setState({shortlist:{...this.state.shortlist,...tempDic}})
         // console.log(this.state.shortlist)
         // this.populateShortlist()
       }
       return responseJson.result;
     }catch(error){
       console.log(error)
     }
  }

    isJobInShortlist = (id) => {
      return this.state.shortlist[id]==id
    }

    // addFooter = () => {
    //   return(
    //     <View style={{height:'3%',borderTopWidth:1,borderColor:'gray'}}></View>
    //   );
    // }


  render(){
    return(
      <View style={{flex:1,height:hp('100%')}}>
        <View style={{alignItems:'center'}}>
          <Text style={[styles.jobTitle,{backgroundColor:helpers.getBackgroundColor(0)}]}>{helpers.capitalize(this.state.job.title)}</Text>
          <Button disabled disabledStyle={{backgroundColor:'#397af8'}}
          disabledTitleStyle={{color:'white',fontWeight:'bold',fontSize:17}}
          icon={<Ionicons name='md-business' size={35} color='white'/>}
           style={{width:wp('87%')}} title={true?' Company | '+this.state.job.company:null}/>
        </View>
        <View style={{marginTop:10,justifyContent:'space-evenly',marginLeft:10,marginRight:15,alignItems:'center',flexDirection:'row',width:wp('95%')}}>
          <Button disabledTitleStyle={{color:'white',fontSize:17}} disabledStyle={{backgroundColor:'orange'}} disabled icon={<MatIcon2 name='map-marker-radius' size={32} color='olive'/>} title={true?this.state.job.location:null} style={{height:hp('7%'),width:wp('41%')}}/>
          <Button disabledTitleStyle={{color:'white',fontSize:16}} disabledStyle={{backgroundColor:'orange'}} disabled style={{height:hp('7%'),width:wp('41%')}} icon={<Icon name='dollar' size={32} color='olive'/>} title={this.state.job.salary==''?'  Not specified':this.state.job.salary}/>
        </View>
        <View style={{marginTop:8,alignItems:'center'}}>
          <Button disabled disabledTitleStyle={{color:'black'}}
          icon={<MatIcon name='date-range' size={35} color='black'/>}
           style={{width:wp('87%')}} title={Math.floor(this.getDaysPosted())>1?(Math.floor(this.getDaysPosted())==1?' Posted 1 day ago':' Posted '+Math.floor(this.getDaysPosted())+' days ago'):' Posted today'}/>
        </View>
        <View style={{justifyContent:'center',alignItems:'center',margin:5}}>
          <Text style={[styles.jobTitle,{backgroundColor:helpers.getBackgroundColor(1),fontSize:24}]}>What you will do:</Text>
        </View>
        <ScrollView>
          <View style={{width:wp('95%'),justifyContent:'center',alignItems:'center'}}>
            <Text style={styles.textStyle}>{this.state.job.text==''?this.state.job.summary:this.state.job.text}</Text>
          </View>
        </ScrollView>
        <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'100%'}}>
          <Button onPress ={() => {
            if(!this.state.guest){
                this.toShortlist(this.state.job.id)
            }else{
                alert("You must create an account in order to have a shortlist.")
            }
          }}
            titleStyle={{fontSize:17}}
            disabled={this.isJobInShortlist(this.state.job.id)}
            style={{height:46,width:wp('43%')}} icon={<Icon
            name={this.isJobInShortlist(this.state.job.id)?'check':'plus-circle'} color='#397af8' size={28}
            />}
            title={this.isJobInShortlist(this.state.job.id)?' Added':' Shortlist'}
            type='outline'
          />
          <Button titleStyle={{fontSize:17}} style={{color:'white', height:46,width:wp('43%')}} onPress={() => Linking.openURL(this.state.job.link)}
          icon={<Icon name='id-card' color='white' size={28}/>} title=' Apply!'/>
        </View>
        <View style={{height:'2.5%',borderTopWidth:1,borderColor:'white'}}></View>

      </View>
    )
  }


}

export default expandJob;

const styles = StyleSheet.create({
  textStyle:{
    marginLeft:'5%',
    padding:10,
    overflow:'hidden',
    backgroundColor:'whitesmoke',
    borderRadius:20
  },
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
    fontSize:30,
    fontWeight:'bold',
    margin:'3%',
    width:wp('87%'),
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
