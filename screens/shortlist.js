import React, {Component} from 'react';
import {Platform,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {NavigationEvents,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {Input,ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconAntD from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import helpers from '../globalFunctions.js';
import IP from '../constants/IP.js';
// const IP = "http://192.168.0.16"
// const IP = "http://172.20.10.6"

class shortListPage extends React.Component{
  constructor(props){
    _isMounted = false
    super(props);
    this.state={
      shortlist:[],
      userid:null,
      refreshing:false,
    }

    this.getUserid();
    setTimeout(()=>{this.populateShortlist()},0.1)

    // setTimeout(()=>this.populateShortlist(),0.5);
    // this.populateShortlist();
    }


componentDidMount = () => {
  this._isMounted = true
}

componentWillUnmount = () => {
  this._isMounted = false
}

renderLogo = () => {
  return (
    <View style={[styles.headerStyle,{paddingTop:13}]}>
     <View style={[styles.innerHeaderStyle,{backgroundColor:'red'}]}>
       <Text style={{color:'white', fontSize:26,fontWeight:'bold'}}>J</Text>
     </View>
     <View style={[styles.innerHeaderStyle,{backgroundColor:'green'}]}>
       <Text style={{color:'white',fontSize:26,fontWeight:'bold'}}>O</Text>
     </View>
     <View style={[styles.innerHeaderStyle,{backgroundColor:'blue'}]}>
        <Text style={{color:'white',fontSize:26,fontWeight:'bold'}}>B</Text>
     </View>
    </View>

  );
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
              this.setState({shortlist:finalResponse.jobs,refreshing:false})
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



refreshShortlist = () => {
  this.setState(state=>({refreshing:true,shortlist:[]}),()=>this.populateShortlist());
}

render(){
  // this.populateShortlist()

    return (
      <View style={styles.container}>
        <NavigationEvents
        onWillFocus={payload=>{
          this.populateShortlist()}}
        />
        <View style={{margin:14,padding:5,paddingTop:20, width:'100%',backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'gray'}}>
          {this.renderLogo()}
          <Text style={{paddingTop:20,paddingRight:20,fontSize:36}}> Shortlist:</Text>
        </View>
        <Button icon={this.state.shortlist.length==0?null:<Icon name='warning' size={30} color='yellow'/>}
        onPress={()=>{this.deleteShortlist(null,true)}} disabled={this.state.shortlist.length==0}
        titleStyle={{fontSize:24}} buttonStyle={{borderRadius:20,width:'100%',backgroundColor:'orange'}}
        title={this.state.shortlist.length!=0?' Clear Shortlist':' Empty Shortlist'}/>
        <FlatList
        refreshing={this.state.refreshing}
        onRefresh={()=>this.refreshShortlist()}
        // onEndReached={()=>this.infiniteScrollSearch()}
        // onEndReachedThreshold={0}
        data={this.state.shortlist}
        keyExtractor={(item,index) =>index.toString()}
        style={{width:'100%',shadowOffSet:{width:0,height:0},shadowOpacity:0.2}}
        ListFooterComponent={() => this.state.prevPageSize!=15 ? null : <ActivityIndicator size='large' animating/>}
        renderItem={({item,index}) => (
          <View style={[styles.col,{shadowColor:helpers.getGradientColor(index)}]}>
            <Text style={[styles.jobTitle,{backgroundColor:helpers.getBackgroundColor(index)}]}>{helpers.capitalize(item[0].title)}</Text>
            <View style={styles.jobInfo}>
              <Text style={styles.jobInfoText}><Text style={{fontWeight:'bold',fontSize:16}}>Company:</Text> {item[0].company}</Text>
              <Text style={styles.jobInfoText}><Text style={{fontWeight:'bold',fontSize:16}}>Location:</Text> {item[0].location}<Text style={{fontWeight:'bold',fontSize:16}}>{'\t'}Salary:</Text> {item[0].salary}</Text>
              <Text style={styles.jobInfoText}>{'\n'}<Text style={{fontWeight:'bold',fontSize:16}}>Summary:</Text> {item[0].summary}{'\n'}</Text>
              <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'100%'}}>
                <Button onPress={()=>{this.deleteShortlist(item[0].id,false)}} buttonStyle={{borderColor:'red'}}
                titleStyle={{color:'red',fontSize:17}} type='outline' style={{height:46,width:wp('26.5%')}}
                icon={<IconAntD name='minuscircle' color='red' size={25} />} title=' Remove' />
                <Button
                titleStyle={{fontSize:17}}
                buttonStyle={{backgroundColor:'#66ccff'}}
                icon={<Icon name='expand' color='white' size={28}/>}
                style={{height:46,width:wp('26.5%')}}
                title='  Expand'
                onPress = {()=>this.props.navigation.push('expandJob',{job:item[0],userid:this.state.userid,display:false})}
                />
                <Button style={{color:'white', height:46,width:wp('26.5%')}} onPress={() => Linking.openURL(item[0].link)}
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



const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column',
    alignItems:"center",
    justifyContent:"center",
  },
  headerStyle:{
    // marginTop:'3%',
    // paddingTop:35,
    flexDirection: 'row',
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'space-evenly',
    flex:-1,
    flexWrap:'nowrap',
    width:'100%',
  },
  innerHeaderStyle:{
    marginHorizontal:'4%',
    width:43,
    height:43,
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
    padding:10,
    color:'white',
    fontSize:22,
    fontWeight:'bold',
    width:'100%',
    paddingTop:5,
    paddingBottom:5,
    borderRadius:7,
    overflow:'hidden'
  },
  jobInfo:{
    margin:12
  },
  jobInfoText:{
    fontSize:14,
  },



});







export default shortListPage;
