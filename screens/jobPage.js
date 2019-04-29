import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,
Linking,TouchableHighlight,FlatList,Text, View,Image} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {SearchBar,Button,Header} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import IP from '../constants/IP.js';
import jobStyle from '../styles/jobStyle.js'

class jobPage extends React.Component{
  constructor(props){
      _isMounted = false
      super(props);
      this.state={
        guest:null,
        userid:null,
        jobs:[],
        page:1,
        refreshing:false,
        prevPageSize:-1,
        shortlist:[],
        location:null,
        waiting:[]
      };

      this.isGuest();
    }



    isGuest = async () => {
      try {
        const value = await AsyncStorage.getItem('userid');
        // console.log(value==null);
        this.setState({guest:value==null})
        await this.getUserid()
        this.getLocation()

      } catch (error) {
        // Error retrieving data
      }
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
                  this.setState({shortlist:finalResponse.jobs.map(job=>{return job[0].id}),waiting:this.state.waiting.map((entry)=>{return false})})
                 }
              })
            return responseJson.result;
          }catch(error){
            console.log(error)
          }
        }
      );
    }

  getLocation = async () =>{
    // console.log(this.state.location)
    // console.log(this.state.userid)
      let url = IP+":3000/api/profiles/userID?q="+this.state.userid;
      // console.log(url)
      await fetch(url)
      .then((response)=>response.json())
      .then((responseJson)=>{
        // console.log(responseJson)
        this.setState(state=>({location:responseJson.profile[0].location}));
        this.populateJobs()
      })
    }


populateJobs = async () => {
  // console.log(this.state.location)
  // console.log(this.state.location.split(', '))
  let url =this.state.location!=null
  ?
  IP+":3000/api/searches?q="+this.state.location.split(',')[0]+"&category=location&page="+this.state.page
  :
  IP+":3000/api/searches?q=&category=all&page="+this.state.page
  // console.log(url)
  await fetch(url)
  .then((response)=>response.json())
  .then((responseJson)=>{
      this.setState(state=>({prevPageSize:responseJson.jobs.length,refreshing:false,
      jobs:this.state.jobs.concat(responseJson.jobs)}));
      this.setState({waiting:new Array(this.state.jobs.length).fill(false)})
      if(!this.state.guest){
          this.populateShortlist()
      }
  })
}

infiniteScroll = () => {
    if(this.state.jobs.length!=0){
      this.setState(state=> ({page:this.state.page+1}), () => this.populateJobs());
    }
}


refreshJobs = () => {
  this.setState(state=>({refreshing:true,page:1,jobs:[]}),()=> this.getLocation());
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

  isJobInShortlist = (id) => {
    return this.state.shortlist.includes(id)
  }

  getDaysPosted = (date) => {
    var curDate = new Date(Date())
    var postedDate = new Date(date)
    var days = (curDate - postedDate)/(1000*60*60*24);
    return days
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



  render(){
      return (
      <View style={jobStyle.container}>
        <NavigationEvents
          onWillFocus={payload=>{
            if(this._isMounted && !this.state.guest){
              this.populateShortlist()
            }
          }}
        />
        <Header
          backgroundColor='transparent'
          leftComponent={<Image
            style={{width:40,height:46}}
            source={require('../assets/PlanetJobLogo.png')}
          />}
          centerComponent={{text:'Recent Jobs',style:jobStyle.headerFontStyle}}
        />
        <SearchBar
          lightTheme
          containerStyle={{backgroundColor:'#e5e7ea',borderColor:'transparent'}}
          inputContainerStyle={{backgroundColor:'white'}}
          placeholder='Search position'/>
        <FlatList
          onEndReached={()=>this.infiniteScroll()}
          onEndReachedThreshold={0}
          data={this.state.jobs}
          refreshing = {this.state.refreshing}
          onRefresh={this.refreshJobs}
          ListFooterComponent={() => this.state.prevPageSize!=15 ? null : <ActivityIndicator size='large' animating/>}
          keyExtractor={(item,index) =>index.toString()}
          style={jobStyle.flalistStyle}
          renderItem={({item,index}) => (
          <TouchableHighlight
            underlayColor='white'
            onPress = {()=>this.props.navigation.push('expandJob',{job:item,userid:this.state.userid})}
          >
            <View style={jobStyle.flatlistView}>
              <View style={jobStyle.mainColumnView}>
                <Text style={jobStyle.jobTitle}>{item.title}</Text>
                <Button
                disabledTitleStyle={jobStyle.colLinesTitle}
                icon={<MatIcon name='business' color='#45546d' size={20}/>}
                disabledStyle={jobStyle.colLines}
                disabled type='clear' title={item.company}
                />
                <Button
                disabledTitleStyle={jobStyle.colLinesTitle}
                icon={<MatIcon name='location-on' color='#45546d' size={20}/>}
                disabledStyle={jobStyle.colLines}
                disabled type='clear' title={item.location}
                />
                <Button
                disabledTitleStyle={jobStyle.colLinesTitle}
                icon={<MatIcon name='monetization-on' color='#45546d' size={20}/>}
                disabledStyle={jobStyle.colLines}
                disabled type='clear' title={item.salary}
                />
                <View style={{flexDirection:'row'}}>
                  <Button icon={<MatIcon name='query-builder' color='lightgray' size={15}/>}
                  disabled disabledTitleStyle={{fontSize:14}}
                  disabledStyle={{paddingRight:30,alignSelf:'auto'}}
                  type='clear' title={Math.floor(this.getDaysPosted(item.date_post))>1?(Math.floor(this.getDaysPosted(item.date_post))==1?' 1 day ago':' '+ Math.floor(this.getDaysPosted(item.date_post))+' days ago'):' Today'}
                  />
                </View>
              </View>
              <Button
              type='clear'
              onPress ={() => {
                      if(!this.state.guest){
                          this.setState({waiting:this.state.waiting.map((entry,i)=>{return i==index?true:false})})
                          if(this.isJobInShortlist(item.id)){
                              this.deleteShortlist(item.id,false)
                          }else{
                              this.toShortlist(item.id)
                          }
                      }else{
                          alert("You must create an account in order to have a shortlist.")
                      }
                      }}
               // loading={this.state.waiting[index]}
               icon={<MatIcon name={this.state.waiting[index]?(this.isJobInShortlist(item.id)?'exposure-neg-1':'exposure-plus-1'):this.isJobInShortlist(item.id)?'bookmark':'bookmark-border'} color='black' size={50}/>}
               // icon={<MatIcon name={this.isJobInShortlist(item.id)?'bookmark':'bookmark-border'} color='black' size={50}/>}
              />
            </View>
          </TouchableHighlight>
          )}
        />
      </View>
      );
    }
}

export default jobPage;
