import React, {Component} from 'react';
import {ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {CheckBox,ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import helpers from '../globalFunctions.js';
import signupPage from './signup.js';



class loginPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {username:null,
    password:null,
    checked:false};
  }


  handleLogin = async () => {
    let userData = {
       username:this.state.username,
       password:this.state.password
     }
     var url = 'http://192.168.0.16:3000/api/Users/login'
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
         this.props.navigation.navigate('MainStack')
       }else{
         alert("Sorry, the username or password is wrong. 💩")
       }
       return responseJson.result;
     }catch(error){
       // console.log('Error?')
       console.log(error)
     }

  }


  render(){
    return (
    <View marginTop='8%' style={{flexDirection:'column',justifyContent:'space-between'}}>
      <View style={{alignItems:'center',justifyContent:'center',marginVertical:'19%'}}>
        <View style={styles.headerStyle}>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'red'}]}>
           <Text style={{color:'white', fontSize:27,fontWeight:'bold'}}>J</Text>
         </View>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'green'}]}>
           <Text style={{color:'white',fontSize:27,fontWeight:'bold'}}>O</Text>
         </View>
         <View style={[styles.innerHeaderStyle,{backgroundColor:'blue'}]}>
            <Text style={{color:'white',fontSize:27,fontWeight:'bold'}}>B</Text>
         </View>
        </View>
      </View>
      <View style={{alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:20, fontFamily:'Avenir'}}> Login to <Text style={{fontWeight:'bold',color:'red'}}>J</Text><Text style={{fontWeight:'bold',color:'green'}}>O</Text><Text style={{fontWeight:'bold',color:'blue'}}>B</Text> and get hired! </Text>
      </View>
      <View style={styles.login}>
        <TextInput
        style={{height:45,borderBottomWidth:2,borderColor:'gray',width:270,padding:7}}
        placeholder='Username'
        onChangeText={(text) => this.setState({username:text})}
        value={this.state.username}
        />
        <TextInput
        secureTextEntry={true}
        style={{height:45,borderBottomWidth:2,borderColor:'gray',width:270,padding:7}}
        placeholder='Password'
        onChangeText={(text) => this.setState({password:text})}
        value={this.state.password}
        />
      </View>
        <View style={{width:'100%',justifyContent:'center',flexDirection:'row'}}>
          <CheckBox iconRight checkedColor='green'
          onPress={()=>this.setState({checked:!this.state.checked})}title='Keep me logged in' checked={this.state.checked}/>
          <Button style={{marginTop:7,marginRight:6}}
          title='Log in'
          onPress={()=> {this.handleLogin()}}/>
        </View>
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
          <Button type='clear' title='Forgot password?'/>
        </View>
        <Button onPress={() => {this.props.navigation.navigate('signupPage')}} icon={
          <Icon
            name='user-circle'
            size={25}
            color='white'
            />
        }
          style={{marginTop:'9%'}} title='  Or create account'
          />
    </View>
  );
}

}




export default loginPage;


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
  login:{
    alignItems:'center',
    justifyContent: 'space-evenly',
    marginTop:'4%'
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
    shadowColor:'gray',
    shadowOpacity:1,
    shadowRadius:5,
  },
  innerHeaderStyle:{
    // marginHorizontal:'2%',
    width:50,
    height:50,
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
