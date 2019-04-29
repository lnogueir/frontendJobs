import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,
  Text, View,Image,StyleSheet,TouchableWithoutFeedback, Keyboard} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Divider,ListItem,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import searchHomeStyle from '../styles/searchHomeStyle.js'
import Autocomplete from 'react-native-autocomplete-input';
import AntIcon from 'react-native-vector-icons/AntDesign';

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
    _isMounted = false
    super(props)
    this.state = {
      guest:false,
      userid:null,
      text: null,
      location:null,
      predictions:[],
      history:[],
      notificationData:[],
      recommended:[],
      shortlist:[],
      index:0,
      updatedRecommendation:[],
      display:true,
  };
  this.isGuest()

  }

  getUserid = async () => {
   try {
     const value = await AsyncStorage.getItem('userid');
     if (value !== null) {
       this.setState({userid:value})
       this.populateShortlist()
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

  componentWillUnmount = () => {
    this._isMounted = false
  }




  updateRecommended = () => {
    // console.log(this.state.index,this.state.recommended.length)
    let updatedRecommendation = []
    if(this.state.recommended.length<3){
      updatedRecommendation=this.state.recommended
    }else{
      if(this.state.index==this.state.recommended.length-1){
        updatedRecommendation.push(this.state.recommended[this.state.index])
        updatedRecommendation=updatedRecommendation.concat(this.state.recommended.slice(0,2))
        this.setState({index:0})
      }else if(this.state.index==this.state.recommended.length-2){
        updatedRecommendation = this.state.recommended.slice(this.state.index)
        updatedRecommendation.push(this.state.recommended[0])
        this.setState({index:0})
      }else{
        updatedRecommendation = this.state.recommended.slice(this.state.index,this.state.index+3)
        this.setState({index:this.state.index+3})
        if(this.state.index+3==this.state.recommended.length){
          this.setState({index:0})
        }
      }
    }
    return updatedRecommendation
  }

  isGuest = async () => {
    try {
      const value = await AsyncStorage.getItem('userid');
      // console.log(value==null);
      this.setState({guest:value==null})
      await this.getUserid()

    } catch (error) {
      // Error retrieving data
    }
  }

  getDaysPosted = (date) => {
    var curDate = new Date(Date())
    var postedDate = new Date(date)
    var days = (curDate - postedDate)/(1000*60*60*24);
    return days
  }

  getRecommended = () => {
    let url = 'http://127.0.0.1:5000/recommendation'
    var data={
      jobsID:this.state.shortlist.map(job=>{return job[0].id})
    }
    // console.log(data)

    fetch(url,{
      method:'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(data)
    }).then(response=>response.json())
      .then(responseJson=>{
        let url = IP+':3000/api/job-posts/jobsArray'
        fetch(url,{
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(responseJson.recommendations)
      }).then((jobResponse)=>jobResponse.json())
        .then((finalResponse)=>{
          this.setState({recommended:finalResponse.jobs})
          this.setState({updatedRecommendation:this.updateRecommended()})
          // console.log(this.state.updatedRecommendation.length)
      })
  })
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
              // console.log(finalResponse)
              if(this._isMounted){
                // console.log(finalResponse.jobs.length!=0)
                this.setState({shortlist:finalResponse.jobs,display:true})
                this.getRecommended()
                if(this.state.shortlist.length==0){
                  this.setState({display:false})
                }
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




  componentDidMount = () => {
    this._isMounted = true
  }




  render() {
    return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={searchHomeStyle.container}>
    <NavigationEvents
    onWillFocus={payload=>{
      if(this.state.userid){
        this.populateShortlist()
      }
    }}
    onWillBlur={payload=>{
      this.setState({index:0})
    }}
    />
      <View style={searchHomeStyle.searchView}>
        <Image
          style={{marginBottom:15,marginTop:25}}
          source={require('../assets/LOGOside.png')}
        />
        <View style={{zIndex:2}}>
          <MatIcon style={searchHomeStyle.icon} name='location-on' color='#45546d' size={32}/>
          <Autocomplete
           onBlur={()=>this.setState({predictions:[]})}
           // containerStyle={{borderColor:'transparent'}}
           style={searchHomeStyle.input}
           listContainerStyle={searchHomeStyle.outsideInput}
           listStyle={{maxHeight:120}}
           autoCorrect={false}
           inputContainerStyle={{borderColor:'transparent'}}
           returnKeyType={'next'}
           clearButtonMode={'while-editing'}
           data={this.state.predictions}
           defaultValue={this.state.location}
           onChangeText={text => this.onChangeDestJOB(text)}
           onSubmitEditing={()=>this.searchInput.focus()}
           underlineColorAndroid='transparent'
           placeholder='Where?'
           renderItem={({ loc }) => (
              <Text style={searchHomeStyle.textIn} onPress={() => this.setState({ location: loc,predictions:[] })}>
                {loc}
              </Text>
            )}
        />
        </View>
        <View style={{zIndex:1,marginTop:10}}>
          <MatIcon style={searchHomeStyle.icon} name='search' color='#45546d' size={32}/>
          <Autocomplete
            style={searchHomeStyle.input}
            listContainerStyle={searchHomeStyle.outsideInput}
            listStyle={{maxHeight:90}}
            onBlur={()=>this.setState({history:[]})}
            autoCorrect={false}
            inputContainerStyle={{borderColor:'transparent'}}
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
               <Text style={[searchHomeStyle.textIn,{color:'purple'}]} onPress={() => this.setState({ text: word,history:[] })}>
                 {word}
               </Text>
             )}
          />
        </View>
        <Button onPress={()=>{
          if((this.state.text==null || this.state.text.length==0||this.state.text==null)&&(this.state.location==null || this.state.location.length==0)){
            alert('Invalid Input. Please fill the entry.');
          }else{
            this.props.navigation.push('findPage',{searchKey:this.state.text,location:this.state.location});
            this.setState({text:''});
        }
          }}
        title='Find Jobs' buttonStyle={searchHomeStyle.searchButton} titleStyle={searchHomeStyle.searchButTitle}/>
      </View>
      <Divider/>
      {!this.state.guest && this.state.display ?
        <View>
          <View style={searchHomeStyle.recomendations}>
            <View style={searchHomeStyle.recommendTitle}>
              <Button onPress={()=>this.setState({updatedRecommendation:this.updateRecommended()})}
              type='clear' icon={<AntIcon name='reload1' color='black' size={25}/>}/>
              <Text style={searchHomeStyle.recommendedText}>Recommended Jobs</Text>
              <Button type='clear' title='View All' titleStyle={{color:'gray'}}/>
            </View>
            <View style={searchHomeStyle.recommendedJobs}>
                {
                  this.state.updatedRecommendation.map((l, i) => (
                    <ListItem
                      containerStyle={{borderBottomWidth:1,borderColor:'gray'}}
                      key={i}
                      leftIcon={<AntIcon name='linechart' color='#4f4338' size={30}/>}
                      // chevron={true}
                      rightTitle={l[0].location}
                      rightTitleStyle={{fontSize:15,fontWeight:'600'}}
                      rightSubtitle={Math.floor(this.getDaysPosted(l[0].date_post))>1?(Math.floor(this.getDaysPosted(l[0].date_post))==1?' 1 day ago':' '+ Math.floor(this.getDaysPosted(l[0].date_post))+' days ago'):' Today'}
                      rightSubtitleStyle={{fontStyle:'italic'}}
                      onPress = {()=>this.props.navigation.push('expandJob',{job:l[0],userid:this.state.userid})}
                      rightIcon={<AntIcon name='right' color='gray' size={25}/>}
                      title={l[0].title}
                      titleStyle={{fontFamily:'Avenir',fontSize:18}}
                      subtitle={l[0].company}
                      subtitleStyle={{fontSize:14,color:'gray'}}
                    />
                  ))
                }
            </View>
          </View>
          <View style={searchHomeStyle.recomendations}>
            <View style={searchHomeStyle.recommendTitle}>
              <Text style={[{paddingLeft:15},searchHomeStyle.recommendedText]}>Recent Shortlisted</Text>
              <Button onPress={()=>this.props.navigation.navigate('Shortlist')} type='clear' title='View All' titleStyle={{color:'gray'}}/>
            </View>
            <View style={searchHomeStyle.recommendedJobs}>
                {
                  this.state.shortlist.slice(0,3).map((l, i) => (
                    <ListItem
                      containerStyle={{borderBottomWidth:1,borderColor:'gray'}}
                      key={i}
                      rightTitle={l[0].location}
                      rightTitleStyle={{fontSize:15,fontWeight:'600'}}
                      rightSubtitle={Math.floor(this.getDaysPosted(l[0].date_post))>1?(Math.floor(this.getDaysPosted(l[0].date_post))==1?' 1 day ago':' '+ Math.floor(this.getDaysPosted(l[0].date_post))+' days ago'):' Today'}
                      rightSubtitleStyle={{fontStyle:'italic'}}
                      leftIcon={<MatIcon name='bookmark' color='#4f4338' size={30}/>}
                      rightTitle={l[0].location}
                      onPress = {()=>this.props.navigation.push('expandJob',{job:l[0],userid:this.state.userid})}
                      rightIcon={<AntIcon name='right' color='gray' size={25}/>}
                      title={l[0].title}
                      titleStyle={{fontFamily:'Avenir',fontSize:18}}
                      subtitle={l[0].company}
                      subtitleStyle={{fontSize:14,color:'gray'}}
                    />
                  ))
                }
            </View>
          </View>
        </View>
        :
        null
      }
    </ScrollView>
  </TouchableWithoutFeedback>


    );
  }
}

export default Home;
