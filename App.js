import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {createSwitchNavigator,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntIcon from 'react-native-vector-icons/Entypo';
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
import notificationJobsPage from './screens/notificationJobs.js';
import notificationPage from './screens/notificationPage.js';





async function isGuest(){
  try {
    const value = await AsyncStorage.getItem('userid');
    // console.log(value==null);
    return value==null;
    // GUEST = value==null;
  } catch (error) {
    // Error retrieving data
  }
}




const notificationJobsExpandStack = createStackNavigator(
  {
    notificationJobsPage:{screen:notificationJobsPage,navigationOptions:{
        title:'New Jobs'
      }},
      expandJob:{screen:expandJob}
    },{
        navigationOptions:{
          header:null
        }
      }
);

notificationJobsExpandStack.navigationOptions = ({navigation})=>{
  return{
    tabBarVisible:navigation.state.index===0,
  }
}

accountNotificationStack = createStackNavigator(
    {
      notificationPage:{screen:notificationPage,navigationOptions:{
        title:'Notifications'
      }},
      notificationJobs:{screen:notificationJobsExpandStack}
    }
)


const jobExpandStack = createStackNavigator(
  {
    Job:{screen:jobPage,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    expandJob:{screen:expandJob}
  }
);

jobExpandStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};

const findExpandStack = createStackNavigator(
  {
    findPage:{screen:findPage},
    expandJob:{screen:expandJob},
  },{
    navigationOptions:{
      header:null
    }
  }
);
findExpandStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};




const shortlistExpandStack = createStackNavigator(
  {
    Shortlist:{screen:shortListPage,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    expandJob:{screen:expandJob}
  }
);
shortlistExpandStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};


const accountPageStack = createStackNavigator(
  {
    accountPage:{screen:accountPage,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}
    }},
    notificationPage:{screen:accountNotificationStack,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    notificationJobsPage:{screen:notificationJobsExpandStack,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}}
  }
)


accountPageStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};


const homeFindStack = createStackNavigator(
  {
    Home:{screen:Home,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    findPage:{screen:findExpandStack,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}},
    notificationJobsPage:{screen:notificationJobsExpandStack,navigationOptions:{
      headerStyle:{height:0},
      headerForceInset:{top:'never',bottom:'never'}}}
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
      tabBarOnPress:async ({navigation})=>{
        const GUEST =  await isGuest();
        // console.log(GUEST)
        if(GUEST){
          alert("You are logged as a guest. Create an account to use shortlist page.")
        }else{
          navigation.navigate('Shortlist');
        }
      },
      tabBarIcon:({tintColor}) => (
        <Icon
        name= "edit"/*"thumb-tack"*/
        color={tintColor}
        size={26}
        />
      )

    })},
    Account:{screen:accountPageStack,navigationOptions:({navigation})=>{
      // const GUEST = await isGuest();
      // console.log(GUEST,"FORA DA FUNCAO"),
      // navigation.navigate('accountPage',{guest:true})
      return {
        tabBarLabel:navigation.getParam('guest',false)?'Sign In':'Profile',
        tabBarIcon:({tintColor})=>
          !navigation.getParam('guest',false)?
          (
            <MatIcon
            name='account'
            color={tintColor}
            size={32}
            />
        ):
        (
          <EntIcon
          name="back"
          color={tintColor}
          size={32}
          />
        ),
      tabBarOnPress:async({navigation})=>{
        const GUEST = await isGuest();
        if(GUEST){
          navigation.navigate('Login');
        }else{
          navigation.navigate('Account');
        }
      },
    }

  }
},
  },{tabBarOptions:{
    // showLabel:false,
    labelStyle:{
      fontSize:13,
    },
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
