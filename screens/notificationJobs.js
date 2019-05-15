import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {NavigationEvents,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import shortListPage from './shortlist.js';
import loginPage from './login.js';
import signupPage from './signup.js';
import IP from '../constants/IP.js';



class notificationJobsPage extends React.Component{
  constructor(props){
    _isMounted=false
    super(props)
    this.state={
      isTyping:false,
      guest:false,
      userid:null,
      notification: this.props.navigation.getParam('notification',[]),
      shortlist:[],
      waiting:[],
      notificationJobs:[],
    }
    // console.log(this.state.notificationJobs)
    this.populateNotificationJobs()
    this.getUserid()

  }

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft:<Button style={{width:wp('24%')}} onPress={()=>navigation.navigate('Home')} title=' App' type='clear' icon={<Icon name='chevron-left' color='#397af8' size={28}/>}/>,
      title:'New Jobs',
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
       this.populateShortlist()
     }
   } catch (error) {
     // Error retrieving data
   }
 };


    componentDidMount = () => {
      this._isMounted = true
    }

    componentWillUnmount = () => {
      this._isMounted = false
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
                  // this.setState({shortlist:finalResponse.jobs})
                  let tempDic={}
                  for(var i=0;i<finalResponse.jobs.length;i++){
                    // console.log(finalResponse.jobs[i])
                    tempDic[finalResponse.jobs[i][0].id]= finalResponse.jobs[i][0].id
                  }
                  this.setState({shortlist:tempDic})
                  // for(var i = 0;i<this.state.shortlist.length;i++){
                  //   console.log(this.state.shortlist[i][0].id)
                  // }
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



    populateNotificationJobs = async () =>{
      let url = IP+':3000/api/job-posts/jobsArray'
      try{
          this.timer = fetch(url,{
          method:'POST',
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
          },
          body:JSON.stringify(this.state.notification)
        }).then((jobResponse)=>jobResponse.json())
          .then((finalResponse)=>{
            // console.log(finalResponse.jobs)
            if(this._isMounted){
              this.setState({notificationJobs:finalResponse.jobs})
             }
          })
        // return responseJson.result;
      }catch(error){
        console.log(error)
      }
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
    return(
      <View style={jobStyle.container}>
        <NavigationEvents
          onWillFocus={payload=>{
            if(this._isMounted && !this.state.userid){
              this.populateShortlist()
            }
          }}
        />
        <SearchBar
          lightTheme
          returnKeyType='done'
          value={this.state.search}
          showLoading={this.state.isTyping}
          containerStyle={{backgroundColor:'#e5e7ea',borderColor:'transparent'}}
          inputContainerStyle={{backgroundColor:'white'}}
          onChangeText={text => {
            this.setState({isTyping:true})
            this.searchFilter(text)
          }}
          onBlur={()=>this.setState({isTyping:false})}
          onCancel={()=>this.setState({isTyping:false})}
          onClear={()=>this.setState({isTyping:false})}
          autoCorrect={false}
          placeholder='Search new jobs'/>
        <FlatList
          data={this.state.notificationJobs}
          keyExtractor={(item,index) =>index.toString()}
          style={jobStyle.flalistStyle}
          renderItem={({item,index}) => (
          <TouchableHighlight
            underlayColor='white'
            onPress = {()=>this.props.navigation.push('expandJob',{job:item[0],userid:this.state.userid})}
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
              <Button
              type='clear'
              onPress ={() => {
                      if(!this.state.guest){
                          this.setState({waiting:this.state.waiting.map((entry,i)=>{return i==index?true:false})})
                          if(this.isJobInShortlist(item[0].id)){
                              this.deleteShortlist(item[0].id,false)
                          }else{
                              this.toShortlist(item[0].id)
                          }
                      }else{
                          alert("You must create an account in order to have a shortlist.")
                      }
                      }}
               // loading={this.state.waiting[index]}
               icon={<MatIcon name={this.state.waiting[index]?(this.isJobInShortlist(item[0].id)?'exposure-neg-1':'exposure-plus-1'):this.isJobInShortlist(item[0].id)?'bookmark':'bookmark-border'} color='black' size={50}/>}
               // icon={<MatIcon name={this.isJobInShortlist(item.id)?'bookmark':'bookmark-border'} color='black' size={50}/>}
              />
            </View>
          </TouchableHighlight>
          )}
        />
      </View>
    )
  }


}


export default notificationJobsPage;


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
    borderBottomWidth:5,
    borderColor:'lightgray',
    shadowOpacity:0.2

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
