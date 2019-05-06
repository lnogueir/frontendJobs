import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,
  Text, View,Image,StyleSheet,KeyboardAvoidingView} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Divider,ThemeProvider,Button,Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import IP from '../constants/IP.js';
import expandStyle from '../styles/expandStyle.js'



class expandJob extends React.Component{
  constructor(props){
    super(props);
    this.state={
      userid:this.props.navigation.getParam('userid','Invalid userid'),
      job:this.props.navigation.getParam('job','Invalid job'),
      shortlist:[],
      guest:null,
      // displayFooter:this.props.navigation.getParam('display','Invalid display'),
    };

    this.isGuest()


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
      title:'Apply',
      headerRight: <Image
        style={{width:40,height:46}}
        source={require('../assets/PlanetJobLogo.png')}
      />,
    }
  }

  isGuest = async () => {
    try {
      const value = await AsyncStorage.getItem('userid');
      // console.log(value==null);
      this.setState({guest:value==null})
      if(!this.state.guest){
        this.populateShortlist()
      }
      this.getDaysPosted()
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
                this.setState({shortlist:finalResponse.jobs.map(job=>{return job[0].id})})
               }
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
         this.setState({shortlist:[...this.state.shortlist,jobId]})
       }
       this.setState({waiting:this.state.waiting.map((entry)=>{return false})})
       return responseJson.result;
     }catch(error){
       console.log(error)
     }
  }

  deleteShortlist = async (jobId,clearAll) =>{
    let shortlistInfo={};
    if(!clearAll){
      shortlistInfo.userID = this.state.userid
      shortlistInfo.jobID = jobId
    }else{
         shortlistInfo.userID=this.state.userid
    }
    if(this.state.shortlist.length!=0){
     var url = IP+':3000/api/Shortlists/deleteShortList'
     try{
       let response = await fetch(url,{
         method:'DELETE',
         headers:{
           'Accept':'application/json',
           'Content-Type':'application/json',
         },
         body:JSON.stringify(shortlistInfo)
       });
       let responseJson = await response.json();
       if(responseJson.error==undefined){
           this.populateShortlist()
       }else{
         alert("Sorry, something went wrong")
       }
       return responseJson.result;
     }catch(error){
       console.log(error)
     }
   }else{
     alert("Shortlist is empty.")
   }
  }

  isJobInShortlist = (id) => {
    return this.state.shortlist.includes(id)
  }

    // addFooter = () => {
    //   return(
    //     <View style={{height:'3%',borderTopWidth:1,borderColor:'gray'}}></View>
    //   );
    // }


  render(){
    return(
      <View style={{flex:1}}>
        <View style={expandStyle.titleStyle}>
          <Text style={expandStyle.fontStyle}>{this.state.job.title.length>30?this.state.job.title.substr(0,29)+'...':this.state.job.title}</Text>
          <View style={expandStyle.rowView}>
            <Button icon={<MatIcon name='query-builder' color='lightgray' size={35}/>}
            disabled disabledTitleStyle={{fontSize:22}}
            disabledStyle={{alignSelf:'flex-start'}}
            type='clear' title={Math.floor(this.getDaysPosted())>1?(Math.floor(this.getDaysPosted())==1?' 1 day ago':' '+Math.floor(this.getDaysPosted())+' days ago'):' Today'}
            />
            <Button
            icon={<MatIcon name='monetization-on' color='lightgray' size={35}/>}
            disabled type='clear' title={this.state.job.salary}
            />
          </View>
          <Button
          disabledTitleStyle={{color:'#45546d',fontSize:22}}
          icon={<MatIcon name='business' color='#45546d' size={35}/>}
          disabled type='clear' title={this.state.job.company}
          disabledStyle={{alignSelf:'center'}}
          />
          <View style={expandStyle.rowView}>
            <Button style={{lineHeight:40}} icon={<MatIcon name='location-on' color='#45546d' size={35}/>}
            disabled disabledTitleStyle={{fontSize:22}}
            type='clear' title={this.state.job.location}
            />
            <MatIcon onPress ={() => {
                if(!this.state.guest){
                  if(this.isJobInShortlist(this.state.job.id)){
                      this.deleteShortlist(this.state.job.id,false)
                  }else{
                      this.toShortlist(this.state.job.id)
                  }
                }else{
                    alert("You must create an account in order to have a shortlist.")
                }
              }}
            style={{lineHeight:60}} raised reverse name={this.isJobInShortlist(this.state.job.id)?'bookmark':'bookmark-border'} color='black' size={63}/>
          </View>
        </View>
        <View style={expandStyle.aboutStyle}>
          <Text style={expandStyle.aboutText}>About the Job</Text>
        </View>
        <ScrollView contentContainerStyle={expandStyle.container}>
            <Text style={expandStyle.textStyle}>{this.state.job.text}</Text>
        </ScrollView>
        <View style={{alignItems:'center',justifyContent:'center'}}>
          <Button style={expandStyle.floatingButt2} titleStyle={expandStyle.applyTitle} buttonStyle={expandStyle.applyButton}
          onPress={() => Linking.openURL(this.state.job.link)}
          title='APPLY'/>
        </View>

        <View style={expandStyle.footer}></View>
    </View>

    )
  }


}

export default expandJob;
