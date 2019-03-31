import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {createSwitchNavigator,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import helpers from './globalFunctions.js';

import shortListPage from './screens/shortlist.js';
import loginPage from './screens/login.js';
import signupPage from './screens/signup.js';
import jobPage from './screens/jobPage.js';
import findPage from './screens/findPage.js';
import Home from './screens/searchHome.js';
import accountPage from './screens/accountPage.js';
import AuthLoadingScreen from './screens/authloadingScreen.js';
import expandJob from './screens/expandJob.js';


const jobExpandStack = createStackNavigator(
  {
    Job:{screen:jobPage,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    expandJob:{screen:expandJob}
  }
)

const findExpandStack = createStackNavigator(
  {
    findPage:{screen:findPage},
    expandJob:{screen:expandJob},
  },{
    navigationOptions:{
      header:null
    }
  }
)

const shortlistExpandStack = createStackNavigator(
  {
    Shortlist:{screen:shortListPage,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    expandJob:{screen:expandJob}
  }
)


const homeFindStack = createStackNavigator(
  {
    Home:{screen:Home,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    findPage:{screen:findExpandStack},
  },



);

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
    Jobs: {screen: jobExpandStack,navigationOptions:({navigation})=>({
      // tabBarOnPress:()=>{
      //
      //   navigation.navigate('Jobs')},
      tabBarIcon:({tintColor}) => (
        <Icon
        name="briefcase"
        color={tintColor}
        size={26}
        />
      )
    })},
    Shortlist:{screen:shortlistExpandStack,
    navigationOptions:()=>({
      tabBarIcon:({tintColor}) => (
        <Icon
        name= "edit"/*"thumb-tack"*/
        color={tintColor}
        size={26}
        />
      )
    })},
    Account:{screen:accountPage,navigationOptions:()=>({
      tabBarIcon:({tintColor})=>(
        <MatIcon
        name='account'
        color={tintColor}
        size={32}
        />
      )
    })},
  },{tabBarOptions:{
    // showLabel:false,
    iconStyle:{
      paddingRight:50
    }
  },
  }
)

const LoginStack = createStackNavigator({
  Login:{screen:loginPage,/*navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}*/},
  // MainStack:{screen:MainStack,navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}},
  signupPage:{screen:signupPage,},
})





const App = createAppContainer(createSwitchNavigator(
  {
  AuthLoading:AuthLoadingScreen,
  Login:LoginStack,
  Main:MainStack,
  },
  {
    initialRouteName:'AuthLoading',
  }
));

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
