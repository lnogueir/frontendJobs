import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,
  Text, View,Image,StyleSheet,TouchableWithoutFeedback, Keyboard} from 'react-native';
import {createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import helpers from '../globalFunctions.js';

import shortListPage from './shortlist.js';
import loginPage from './login.js';
import signupPage from './signup.js';

class Home extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      text: '',
  };

  }

  render() {
    return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <View style={styles.headerStyle}>
         <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'red',width:50,height:50,borderRadius:7}}>
           <Text style={{color:'white', fontSize:33,fontWeight:'bold'}}>J</Text>
         </View>
         <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'green',width:50,height:50,borderRadius:7}}>
           <Text style={{color:'white',fontSize:33,fontWeight:'bold'}}>O</Text>
         </View>
         <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'blue',width:50,height:50,borderRadius:7}}>
             <Text style={{color:'white',fontSize:33,fontWeight:'bold'}}>B</Text>
         </View>
      </View>
      <View style={{margin:'3%'}}>
        <TextInput
        clearButtonMode='while-editing'
        style={{height:45,borderWidth:2,borderColor:'gray',width:200,padding:7}}
        placeholder='Search position!'
        onChangeText={(text) => this.setState({text:text})}
        returnKeyType={'search'}
        onSubmitEditing={()=>{
          if(this.state.text==undefined || this.state.text.length==0){
            alert('Invalid Input. Please fill the entry.');
          }else{
            this.props.navigation.push('findPage',{searchKey:this.state.text});
            this.setState({text:''});
        }
        }}
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
  </TouchableWithoutFeedback>
    );
  }
}

export default Home;

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
