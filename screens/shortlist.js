import React, {Component} from 'react';
import {Platform,AsyncStorage, TouchableHighlight,TextInput,Alert,Linking,FlatList,Text, View,Image} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {SearchBar,Input,ThemeProvider,Button,Header} from 'react-native-elements';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import IP from '../constants/IP.js';
import jobStyle from '../styles/jobStyle.js'

class shortListPage extends React.Component{
  constructor(props){
    _isMounted = false
    arrayHolder=[]
    super(props);
    this.state={
      isTyping:false,
      shortlist:[],
      userid:null,
      search:'',
      refreshing:false,
      display:true,
      waiting:false,
    }

    this.getUserid();
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
              // console.log(finalResponse.jobs.length!=0)
              this.arrayHolder = finalResponse.jobs
              this.setState({shortlist:finalResponse.jobs,refreshing:false,display:true})
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


 getUserid = async () => {
  try {
    const value = await AsyncStorage.getItem('userid');
    if (value !== null) {
      this.setState({userid:value})
      this.populateShortlist()
    }
  } catch (error) {
    // Error retrieving data
  }
};



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
 getDaysPosted = (date) => {
   var curDate = new Date(Date())
   var postedDate = new Date(date)
   var days = (curDate - postedDate)/(1000*60*60*24);
   return days
 }


refreshShortlist = () => {
  this.setState(state=>({refreshing:true,shortlist:[]}),()=>this.populateShortlist());
}

searchFilter = (text) => {
  if(text){
    const newData = this.arrayHolder.filter(item => {
      const itemData = `${item[0].title.toUpperCase()}
      ${item[0].location.toUpperCase()} ${item[0].company.toUpperCase()}`;
       const textData = text.toUpperCase();

       return itemData.indexOf(textData) > -1;
    });
    this.setState({ shortlist: newData,search:text });
  }else{
    this.setState({ shortlist: this.arrayHolder,search:text , isTyping:false});
  }
}

render(){
    return (
    <View style={jobStyle.container}>
      <NavigationEvents
        onWillFocus={payload=>{
          this.populateShortlist()}}
        onWillBlur={payload=>this.setState({display:true})}
      />
      <Header
        backgroundColor='transparent'
        leftComponent={<Image
          style={{width:40,height:46}}
          source={require('../assets/PlanetJobLogo.png')}
        />}
        centerComponent={{text:'Favorite Jobs',style:jobStyle.headerFontStyle}}
        rightComponent={<Button disabled={this.state.shortlist.length==0} type='clear' title='Clear' onPress={()=>this.deleteShortlist(null,true)}/>}
      />
      {!this.state.display?
        null
        :
      <SearchBar
      lightTheme
      returnKeyType='done'
      value={this.state.search}
      showLoading={this.state.isTyping}
      containerStyle={{backgroundColor:'#e5e7ea',borderColor:'transparent'}}
      inputContainerStyle={{backgroundColor:'white'}}
      placeholder='Search in shortlist'
      onChangeText={text => {
        this.setState({isTyping:true})
        this.searchFilter(text)
      }}
      onBlur={()=>this.setState({isTyping:false})}
      onCancel={()=>this.setState({isTyping:false})}
      onClear={()=>this.setState({isTyping:false})}
      autoCorrect={false}
        />
      }
      {
        (this.state.waiting && this.state.shortlist.length>1)
        ?
        <MatIcon name='exposure-neg-1' color='black' size={65}/>
        :
        null
      }
      {!this.state.display
        ?
          <View style={{alignItems:'center',flex:1,justifyContent:'space-evenly'}}>
            <Button disabled title='Empty Shortlist' disabledTitleStyle={{fontSize:30}}buttonStyle={{borderRadius:30,width:'100%'}}/>
            <Icon name='question-circle' color='black' size={300}/>
          </View>
          :
        <FlatList
          data={this.state.shortlist}
          keyExtractor={(item,index) =>index.toString()}
          style={jobStyle.flalistStyle}
          renderItem={({item,index}) => (
            <TouchableHighlight
              underlayColor='white'
              onPress = {()=>this.props.navigation.push('expandJob',{job:item[0],userid:this.state.userid,display:false})}
            >
              <View style={jobStyle.flatlistView}>
                <View style={jobStyle.mainColumnView}>
                  <Text style={jobStyle.jobTitle}>{item[0].title}</Text>
                  <Button
                  disabledTitleStyle={jobStyle.colLinesTitle}
                  icon={<MatIcon name='business' color='#45546d' size={20}/>}
                  disabledStyle={jobStyle.colLines}
                  disabled type='clear' title={item[0].company}
                  />
                  <Button
                  disabledTitleStyle={jobStyle.colLinesTitle}
                  icon={<MatIcon name='location-on' color='#45546d' size={20}/>}
                  disabledStyle={jobStyle.colLines}
                  disabled type='clear' title={item[0].location}
                  />
                  <Button
                  disabledTitleStyle={jobStyle.colLinesTitle}
                  icon={<MatIcon name='monetization-on' color='#45546d' size={20}/>}
                  disabledStyle={jobStyle.colLines}
                  disabled type='clear' title={item[0].salary}
                  />
                  <View style={{flexDirection:'row'}}>
                    <Button icon={<MatIcon name='query-builder' color='lightgray' size={15}/>}
                    disabled disabledTitleStyle={{fontSize:14}}
                    disabledStyle={{paddingRight:30,alignSelf:'auto'}}
                    type='clear' title={Math.floor(this.getDaysPosted(item[0].date_post))>1?(Math.floor(this.getDaysPosted(item[0].date_post))==1?' 1 day ago':' '+ Math.floor(this.getDaysPosted(item[0].date_post))+' days ago'):' Today'}
                    />
                  </View>
                </View>
                <View style={{width:'30%', paddingHorizontal:35}}>
                  <MatIcon onPress={()=>{
                    this.setState({waiting:true})
                    this.deleteShortlist(item[0].id,false)
                    setTimeout(()=>{this.setState({waiting:false})},750)
                  }}
                  name={'bookmark'} color='black' size={50}/>
                </View>
              </View>
            </TouchableHighlight>
          )}
        />
      }
    </View>
    );



  }
}


export default shortListPage;
