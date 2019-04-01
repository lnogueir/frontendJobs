import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text,
  View,Image,StyleSheet} from 'react-native';
import {NavigationEvents,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const IP = "http://192.168.0.16"
// const IP = "http://172.20.10.6"

class findPage extends React.Component{

  constructor(props){
    super(props);
    _isMounted = false
    this.state={
      userid:null,
      prevPageSize:-1,
      display:true,
      key:this.props.navigation.getParam('searchKey','Invalid Input'),
      searchData:[],
      refreshing:false,
      page:1,
      shortlist:{},
    };
    this.populateSearch()
    this.getUserid()
    setTimeout(()=>{this.populateShortlist()},0.1)
  }




  static navigationOptions = ({navigation}) => {
    return {
      headerLeft:<Button style={{width:wp('24%')}} onPress={()=>navigation.navigate('Home')} title=' Search' type='clear' icon={<Icon name='chevron-left' color='#397af8' size={28}/>}/>,
      title: 'Results for "'+navigation.getParam('searchKey','Invalid Input')+'":',
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

  // populateSearch = (index) => { //HOW TO LOOP THROUGH PAGES
  //   let url = "http://10.36.51.13:3000/api/searches?q="+this.state.key+"&category=generic&page="+index.toString();
  //   fetch(url)
  //   .then((response)=>response.json())
  //   .then((responseJson)=>{
  //     if(responseJson.jobs.length!=0){
  //       this.setState({display:true,searchData:this.state.searchData.concat(responseJson.jobs)});
  //       this.populateSearch(index+1);
  //     }else if(this.state.searchData==0){
  //       this.setState({display:false});
  //     }
  //   })
  // }


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

    populateSearch = async () => {
      let url = IP+":3000/api/searches?q="+this.state.key+"&category=generic&page="+this.state.page
      await fetch(url)
      .then((response)=>response.json())
      .then((responseJson)=>{
        if(responseJson.jobs.length!=0){
          this.setState(state=>({display:true,prevPageSize:responseJson.jobs.length,refreshing:false,
          searchData:this.state.searchData.concat(responseJson.jobs)}));
        }else{
          if(this.state.searchData.length==0){
            this.setState({display:false});
          }
        }
      })
    }

    infiniteScrollSearch = () => {
      setTimeout(()=>{
        if(this.state.searchData.length!=0){
          this.setState(state=> ({page:this.state.page+1}), () => this.populateSearch());
        }
      },100);
    }


    refreshSearch = () => {
      this.setState(state=>({refreshing:true,page:1,searchData:[]}),()=>this.populateSearch());
    }

    isJobInShortlist = (id) => {
      return this.state.shortlist[id]==id
    }






  render(){
    // this.populateShortlist()
    if(this.state.display){
    return (
      <View style={styles.container}>
      <FlatList
      refreshing={this.state.refreshing}
      onRefresh={()=>this.refreshSearch()}
      onEndReached={()=>this.infiniteScrollSearch()}
      onEndReachedThreshold={0}
      data={this.state.searchData}
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
            <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'100%'}}>
            <Button onPress ={() => {this.toShortlist(item.id)}}
              titleStyle={{fontSize:17}}
              disabled={this.isJobInShortlist(item.id)}
              style={{height:46,width:wp('26.5%')}} icon={<Icon
              name={this.isJobInShortlist(item.id)?'check':'plus-circle'} color='#397af8' size={28}
              />}
              title={this.isJobInShortlist(item.id)?' Added':' Shortlist'}
              type='outline'
            />
            <Button
            titleStyle={{fontSize:17}}
            buttonStyle={{backgroundColor:'#66ccff'}}
            icon={<Icon name='expand' color='white' size={28}/>}
            style={{height:46,width:wp('26.5%')}}
            title='  Expand'
            onPress = {()=>this.props.navigation.push('expandJob',{jobId:item.id})}
            />
            <Button style={{color:'white', height:46,width:wp('26.5%')}} onPress={() => Linking.openURL(item.link)}
            titleStyle={{fontSize:17}}
            icon={<Icon name='id-card' color='white' size={28}/>} title=' Apply!'/>
            </View>
          </View>
        </View>
      )}
      />
      </View>
    );
  }
  else{
    return (
      <View style={styles.container}>
        <Text style={{margin:'10%',fontSize:40,fontWeight:'bold'}}>Sorry, no results have been found.{'\n'}</Text>
        <Icon
        name="frown-o"
        color='black'
        size={250}
        />
      </View>
    );
  }
  }
}

export default findPage;





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
