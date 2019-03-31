import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {NavigationEvents,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import helpers from '../globalFunctions.js';

import shortListPage from './shortlist.js';
import loginPage from './login.js';
import signupPage from './signup.js';

const IP = "http://192.168.0.16"
// const IP = "http://172.20.10.6"

class jobPage extends React.Component{
  constructor(props){
      _isMounted = false
      super(props);
      this.state={
        userid:null,
        jobs:[],
        page:1,
        refreshing:false,
        prevPageSize:-1,
        shortlist:{},
        location:null,
      };
      this.getUserid();
      setTimeout(()=>this.getLocation(),1);
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
          let url = IP+':3000/api/indeed-jobs/jobsArray'
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

  getLocation = async () =>{
    // console.log(this.state.location)
      let url = IP+":3000/api/profiles/userID?q="+this.state.userid;
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
  var location = this.state.location.split(',')
  // console.log(location)
  var city = location[0]
  let url = IP+":3000/api/searches?q="+city+"&category=location&page="+this.state.page;
  await fetch(url)
  .then((response)=>response.json())
  .then((responseJson)=>{
      this.setState(state=>({prevPageSize:responseJson.jobs.length,refreshing:false,
      jobs:this.state.jobs.concat(responseJson.jobs)}));
      this.populateShortlist()
  })
}

infiniteScroll = () => {
  setTimeout(()=>{
    if(this.state.jobs.length!=0){
      this.setState(state=> ({page:this.state.page+1}), () => this.populateJobs());
    }
  },100);
}


refreshJobs = () => {
  this.setState(state=>({refreshing:true,page:1,jobs:[]}),()=> this.populateJobs());
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




  render(){
    // this.populateShortlist()
      return (
      <View style={styles.container}>
        <NavigationEvents
        onWillFocus={payload=>{
          this.setState({jobs:[]})
          setTimeout(()=>this.getLocation(),1)
        }}
        />
        <View style={styles.headerStyle}>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'red'}]}>
           <Text style={{color:'white', fontSize:25,fontWeight:'bold'}}>J</Text>
         </View>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'green'}]}>
           <Text style={{color:'white',fontSize:25,fontWeight:'bold'}}>O</Text>
         </View>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'blue'}]}>
            <Text style={{color:'white',fontSize:25,fontWeight:'bold'}}>B</Text>
         </View>
        </View>

          <FlatList
          onEndReached={()=>this.infiniteScroll()}
          onEndReachedThreshold={0}
          data={this.state.jobs}
          refreshing = {this.state.refreshing}
          onRefresh={this.refreshJobs}
          keyExtractor={(item,index) =>index.toString()}
          style={{width:'100%',shadowOffSet:{width:0,height:0},shadowOpacity:0.2}}
          ListFooterComponent={() => this.state.prevPageSize!=15 ? null : <ActivityIndicator size='large' animating/>}
          renderItem={({item,index}) => (
              <View style={[styles.col,{shadowColor:helpers.getGradientColor(index)}]}>
                <Text style={[styles.jobTitle,{backgroundColor:helpers.getBackgroundColor(index)}]}>{item.title}</Text>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobInfoText}><Text style={{fontWeight:'bold',fontSize:16}}>Company:</Text> {item.company}</Text>
                  <Text style={styles.jobInfoText}><Text style={{fontWeight:'bold',fontSize:16}}>Location:</Text> {item.location}<Text style={{fontWeight:'bold',fontSize:16}}>{'\t'}Salary:</Text> {item.salary}</Text>
                  <Text style={styles.jobInfoText}>{'\n'}<Text style={{fontWeight:'bold',fontSize:16}}>Summary:</Text> {item.summary}{'\n'}</Text>
                  <View style={{flexDirection:'row',justifyContent:'space-evenly',widht:'100%'}}>
                    <Button onPress ={() => {this.toShortlist(item.id)}}
                      titleStyle={{fontSize:17}}
                      disabled={this.isJobInShortlist(item.id)}
                      style={{height:46,width:110}} icon={<Icon
                      name={this.isJobInShortlist(item.id)?'check':'plus-circle'} color='#397af8' size={28}
                      />}
                      title={this.isJobInShortlist(item.id)?' Added':' Shortlist'}
                      type='outline'
                    />
                    <Button
                    titleStyle={{fontSize:17}}
                    buttonStyle={{backgroundColor:'#66ccff'}}
                    icon={<Icon name='expand' color='white' size={28}/>}
                    style={{height:46,width:110}}
                    title='  Expand'
                    onPress = {()=>this.props.navigation.push('expandJob',{jobId:item.id})}
                    />
                    <Button titleStyle={{fontSize:17}} style={{color:'white', height:46,width:110}} onPress={() => Linking.openURL(item.link)}
                    icon={<Icon name='id-card' color='white' size={28}/>} title=' Apply!'/>
                  </View>
                </View>
              </View>

          )}
          />
        </View>

      );
    }
}

export default jobPage;


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
    fontFamily:'Avenir',
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
