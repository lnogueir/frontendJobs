import React, {Component} from 'react';
import {ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import helpers from './globalFunctions.js';

import shortListPage from './screens/shortlist.js';
import loginPage from './screens/login.js';
import signupPage from './screens/signup.js';



class findPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      prevPageSize:-1,
      display:true,
      key:this.props.navigation.getParam('searchKey','##Invalid Input##'),
      searchData:[],
      refreshing:false,
      page:1,
    };
    this.populateSearch()

  }



  static navigationOptions = ({navigation}) => {
    return {
      // headerLeft:<Button title=' Search' onPress={() => navigation.goBack()}/>,
      title: 'Results for "'+navigation.getParam('searchKey','##Invalid Input##')+'":',

    }
  }


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


    populateSearch = async () => {
      let url = "http://192.168.0.16.:3000/api/searches?q="+this.state.key+"&category=generic&page="+this.state.page
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
      },1600);
    }


    refreshSearch = () => {
      this.setState(state=>({refreshing:true,page:1,searchData:[]}),()=>this.populateSearch());
    }






  render(){
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
              <Button style={{height:46,width:140}} icon={<Icon
                name='plus-circle' color='#397af8' size={32}
                />}
                title=' Shortlist'
                type='outline'
              />
              <Button style={{color:'white', height:46,width:140}} onPress={() => Linking.openURL('https://'+item.link)}
              icon={<Icon name='id-card' color='white' size={32}/>} title=' Apply!'/>
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



class Home extends React.Component{
  constructor(props){
    super(props)
    var navigation = this.props.navigation;
    this.state = {text: ''};
  }




  render() {
    return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
         <View style={{backgroundColor:'red',width:50,height:50,borderRadius:7}}>
           <Text style={{paddingTop:7,paddingLeft:15,color:'white', fontSize:30,fontWeight:'bold'}}>J</Text>
         </View>
         <View style={{backgroundColor:'green',width:50,height:50,borderRadius:7}}>
           <Text style={{paddingTop:7,paddingLeft:15,color:'white',fontSize:30,fontWeight:'bold'}}>O</Text>
         </View>
         <View style={{backgroundColor:'blue',width:50,height:50,borderRadius:7}}>
             <Text style={{paddingTop:7,paddingLeft:15,color:'white',fontSize:30,fontWeight:'bold'}}>B</Text>
         </View>
      </View>
      <View style={{margin:'3%'}}>
        <TextInput
        style={{height:45,borderWidth:2,borderColor:'gray',width:200,padding:7}}
        placeholder='Search position!'
        onChangeText={(text) => this.setState({text:text})}
        value={this.state.text}
        />
        <Button
        onPress={()=>{
          //console.log(this.state.text)
          if(this.state.text==undefined || this.state.text.length==0){
            alert('Invalid Input. Please fill the entry.');
          }else{
            this.props.navigation.push('findPage',{searchKey:this.state.text});
            this.setState({text:''});
        }
          }}
        title=' Find'
        icon={<Icon name='safari' size={20} color='lightgray'/>}
        // iconRight
        type='clear'
        />
      </View>
    </View>
    );
  }
}





class jobPage extends React.Component{

  constructor(props){
      super(props);
      this.state={
        jobs:[],
        page:1,
        refreshing:false,
        prevPageSize:-1,
      };
      this.populateJobs();
    }


populateJobs = async () => {
  let url = "http://192.168.0.16.:3000/api/searches?category=all&page="+this.state.page;
  await fetch(url)
  .then((response)=>response.json())
  .then((responseJson)=>{
      this.setState(state=>({prevPageSize:responseJson.jobs.length,refreshing:false,
      jobs:this.state.jobs.concat(responseJson.jobs)}));
  })
}

infiniteScroll = () => {
  setTimeout(()=>{
    if(this.state.jobs.length!=0){
      this.setState(state=> ({page:this.state.page+1}), () => this.populateJobs());
    }
  },1600);
}


refreshJobs = () => {
  this.setState(state=>({refreshing:true,page:1,jobs:[]}),()=>this.populateJobs());
}


  render(){
      return (
      <View style={styles.container}>
        <View style={styles.headerStyle}>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'red'}]}>
           <Text style={{color:'white', fontSize:23,fontWeight:'bold'}}>J</Text>
         </View>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'green'}]}>
           <Text style={{color:'white',fontSize:23,fontWeight:'bold'}}>O</Text>
         </View>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'blue'}]}>
            <Text style={{color:'white',fontSize:23,fontWeight:'bold'}}>B</Text>
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
                  <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'100%'}}>
                    <Button style={{height:46,width:140}} icon={<Icon
                      name='plus-circle' color='#397af8' size={32}
                      />}
                      title=' Shortlist'
                      type='outline'
                    />
                    <Button style={{color:'white', height:46,width:140}} onPress={() => Linking.openURL('https://'+item.link)}
                    icon={<Icon name='id-card' color='white' size={32}/>} title=' Apply!'/>
                  </View>
                </View>
              </View>

          )}
          />
        </View>

      );
    }
}


const homeFindStack = createStackNavigator(
  {
    Home:{screen:Home,navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}},
    findPage:{screen:findPage}
  },
)

homeFindStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};


const MainStack = createBottomTabNavigator(
  {
    Search: {screen: homeFindStack,navigationOptions:()=>({
      tabBarIcon:({tintColor}) => (
        <Icon
          name="search"
          color={tintColor}
          size={26}
        />
      )
    })},
    Jobs: {screen: jobPage,navigationOptions:()=>({
      tabBarIcon:({tintColor}) => (
        <Icon
        name="briefcase"
        color={tintColor}
        size={26}
        />
      )
    })},
    Shortlist:{screen:shortListPage,
    navigationOptions:()=>({
      tabBarIcon:({tintColor}) => (
        <Icon
        name= "edit"/*"thumb-tack"*/
        color={tintColor}
        size={26}
        />
      )
    })}
  },
  {tabBarOptions:{
    // showLabel:false,
    iconStyle:{
      paddingRight:50
    }

  }}
)

const LoginStack = createStackNavigator({
  Login:{screen:loginPage,/*navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}*/},
  MainStack:{screen:MainStack,navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}},
  signupPage:{screen:signupPage,},
})




const App = createAppContainer(LoginStack);

export default App;





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
