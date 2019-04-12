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
import helpers from '../globalFunctions.js';
import shortListPage from './shortlist.js';
import loginPage from './login.js';
import signupPage from './signup.js';
import IP from '../constants/IP.js';



class notificationJobsPage extends React.Component{
  constructor(props){
    super(props)
    this.state={
      userid:null,
      notification: this.props.navigation.getParam('notification',[]),
      shortlist:{},
      notificationJobs:[],
    }
    // console.log(this.state.notificationJobs)
    this.populateNotificationJobs()
    this.getUserid()
    setTimeout(()=>{this.populateShortlist()},1)

  }

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft:<Button style={{width:wp('24%')}} onPress={()=>navigation.navigate('Home')} title=' App' type='clear' icon={<Icon name='chevron-left' color='#397af8' size={28}/>}/>,
      title:'New Jobs'
    }
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
         if(responseJson.error==undefined){
           let tempDic = {}
           tempDic[jobId] = jobId
           this.setState({shortlist:{...this.state.shortlist,...tempDic}})
           // this.populateShortlist()
           // alert("Job added to shortlist")
         }else{
           alert("Sorry, something went wrong")
         }
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


    populateNotificationJobs = async () =>{
      let url = IP+':3000/api/indeed-jobs/jobsArray'
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



  isJobInShortlist = (id) => {
    return this.state.shortlist[id]==id
  }

  render(){
    return(
      <View style={styles.container}>
      <NavigationEvents
      onWillFocus={payload=>{
        setTimeout(()=>this.populateShortlist(),10)
      }}
      />
      <FlatList
      data={this.state.notificationJobs}
      keyExtractor={(item,index) =>index.toString()}
      style={{width:'100%',shadowOffSet:{width:0,height:0},shadowOpacity:0.2}}
      // ListFooterComponent={() => this.state.prevPageSize!=15 ? null : <ActivityIndicator size='large' animating/>}
      renderItem={({item,index}) => (
        <View style={[styles.col,{shadowColor:helpers.getGradientColor(index)}]}>
          <Text style={[styles.jobTitle,{backgroundColor:helpers.getBackgroundColor(index)}]}>{helpers.capitalize(item[0].title)}</Text>
          <View style={styles.jobInfo}>
            <Text style={styles.jobInfoText}><Text style={{fontWeight:'bold',fontSize:16}}>Company:</Text> {item[0].company}</Text>
            <Text style={styles.jobInfoText}><Text style={{fontWeight:'bold',fontSize:16}}>Location:</Text> {item[0].location}<Text style={{fontWeight:'bold',fontSize:16}}>{'\t'}Salary:</Text> {item[0].salary}</Text>
            <Text style={styles.jobInfoText}>{'\n'}<Text style={{fontWeight:'bold',fontSize:16}}>Summary:</Text> {item[0].summary}{'\n'}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'100%'}}>
            <Button onPress ={() => {
                  this.toShortlist(item[0].id)
            }}
              titleStyle={{fontSize:17}}
              disabled={this.isJobInShortlist(item[0].id)}
              style={{height:46,width:wp('26.5%')}} icon={<Icon
              name={this.isJobInShortlist(item[0].id)?'check':'plus-circle'} color='#397af8' size={28}
              />}
              title={this.isJobInShortlist(item[0].id)?' Added':' Shortlist'}
              type='outline'
            />
            <Button
            titleStyle={{fontSize:17}}
            buttonStyle={{backgroundColor:'#66ccff'}}
            icon={<Icon name='expand' color='white' size={28}/>}
            style={{height:46,width:wp('26.5%')}}
            title='  Expand'
            onPress = {()=>this.props.navigation.push('expandJob',{job:item[0],userid:this.state.userid/*,display:true*/})}
            />
            <Button style={{color:'white', height:46,width:wp('26.5%')}} onPress={() => Linking.openURL(item[0].link)}
            titleStyle={{fontSize:17}}
            icon={<Icon name='id-card' color='white' size={28}/>} title=' Apply!'/>
            </View>
          </View>
        </View>
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
