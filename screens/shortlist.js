import React, {Component} from 'react';
import {ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import helpers from '../globalFunctions.js';



class shortListPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      saves:[],

    }
  }

renderLogo = () => {
  return (
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

  );


}

render(){
  if(this.state.saves.length==0){
  return (
    <View>
      <View style={{paddingRight:'6%',backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'gray'}}>
        {this.renderLogo()}
        <Text style={{marginTop:'10%',marginLeft:15,paddingRight:'4%',fontFamily:'Avenir',fontSize:35,paddingTop:10}}> Shortlist:</Text>
      </View>

      <View style={{marginTop:'20%',alignItems:'center',justifyContent:'center'}}>
        <Text style={{marginHorizontal:'3%',fontSize:35}}>You haven't added{'\n'}any job to your shortlist.</Text>
        <Text style={{fontSize:35,margin:'3%'}}>Click on the <Icon name='plus-circle' color='black' size={38}/> icon to add jobs.{'\n'}</Text>
        <Icon
          raised
          reverse
          name='hourglass-3'
          color='black'
          size={230}
        />
      </View>
    </View>
  );
  }
  else{



  }
}

}

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
    padding:10,
    color:'white',
    fontSize:22,
    fontWeight:'bold',
    fontFamily:'Avenir',
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
