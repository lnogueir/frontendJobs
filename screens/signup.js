import React, {Component} from 'react';
import {ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {ThemeProvider,Button,Header,CheckBox} from 'react-native-elements';
import {LinearGradient} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import helpers from '../globalFunctions.js';


const IP = "http://192.168.0.16"
// const IP = "http://172.20.10.6"



class signupPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username:null,
      checked:false,
      password:null,
      email:null,
      location:null
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Create Account'
    }
  }

  createProfile = async (userid) =>{
    console.log(this.state.userid)
    let userData = {
      userID:userid,
      username:this.state.username,
      email:this.state.email,
      location:this.state.location
    }
    var url = IP+':3000/api/profiles'
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
    console.log(responseJson)
    return responseJson.result
  }catch(error){
    console.log(error)
  }
}

  createAccount = async () =>{
    let userData = {
       username:this.state.username,
       password:this.state.password,
       email:this.state.email
       // location:this.state.location
     }
     var url = IP+':3000/api/Users'
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
       // console.log(responseJson)
       if(responseJson.error == undefined){
         await alert('Congratulations! 🥳  Your account has been successfully created. You are ready to get HIRED!')
         this.createProfile(responseJson.id)
         this.props.navigation.goBack()
       }
       else{
         alert("The email or username you have entered already exists. 💩")

       }
       return responseJson.result;
     }catch(error){
       console.log(error)
     }
}


  render(){
    return (
      // <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
      //  <View style={{backgroundColor:'red',width:50,height:50}}></View>
      //  <View style={{backgroundColor:'green',width:50,height:50}}></View>
      //  <View style={{backgroundColor:'blue',width:50,height:50}}></View>
      // </View>
      <View style={{flex:1,height:'100%'}}>
      <View style={{height:'20%',shadowColor:'gray',shadowOpacity:1,shadowRadius:5
      ,flexDirection:'row',justifyContent:'space-evenly',
      alignItems:'center'}}>
        <View style={[{backgroundColor:'red'},styles.innerHeaderStyle]}></View>
        <View style={[{backgroundColor:'green'},styles.innerHeaderStyle]}></View>
        <View style={[{backgroundColor:'blue'},styles.innerHeaderStyle]}></View>
      </View>
         <View style={{marginLeft:'13%',marginRight:'13%',flexDirection:'column'}}>
            <Text style={{margin:5,fontSize:23}}><Icon name='user-circle' color='black' size={30}/> Username: </Text>
            <TextInput
            clearButtonMode='while-editing'
            style={{height:40,borderWidth:2,borderColor:'gray',width:230,padding:7}}
            placeholder='Username'
            onChangeText={(text) => this.setState({username:text})}
            value={this.state.username}
            />
         </View>
         <View style={{marginTop:'3%',marginRight:'13%',marginLeft:'13%',flexDirection:'column'}}>
              <Text style={{margin:5,fontSize:23}}><Icon name='hashtag' color='black' size={30}/> Password:  </Text>
              <View style={{flexDirection:'row'}}>
                <TextInput
                clearButtonMode='while-editing'
                secureTextEntry={!this.state.checked}
                style={{height:40,borderWidth:2,borderColor:'gray',width:230,padding:7}}
                placeholder='Password'
                onChangeText={(text) => this.setState({password:text})}
                value={this.state.password}
                />
                <CheckBox containerStyle={{paddingLeft:1,backgroundColor:'white',borderWidth:0}}
                onPress={()=>this.setState({checked:!this.state.checked})}
                 title='Show' checked={this.state.checked}
                />
              </View>
         </View>
         <View style={{marginRight:'13%',marginLeft:'13%',flexDirection:'column'}}>
              <Text style={{margin:5,fontSize:23}}><MatIcon name='email' color='black' size={30}/> Email:  </Text>
              <TextInput
              style={{height:40,borderWidth:2,borderColor:'gray',width:230,padding:7}}
              placeholder='example@email.com'
              onChangeText={(text) => this.setState({email:text})}
              value={this.state.email}
              />
         </View>
         <View style={{marginTop:'3%',marginRight:'13%',marginLeft:'13%',flexDirection:'column'}}>
              <Text style={{margin:5,fontSize:23}}><MatIcon name='map-marker-radius' color='black' size={30}/> Job City:  </Text>
              <TextInput
              style={{height:40,borderWidth:2,borderColor:'gray',width:230,padding:7}}
              placeholder='Canada, Ontario, Toronto'
              onChangeText={(text) => this.setState({location:text})}
              value={this.state.location}
              />
          </View>
          <Button onPress={() => {this.createAccount()} } style={{width:'50%',alignSelf:'center',marginVertical:'11%'}} type='outline' title='Sign Up'/>
      </View>
    );

  }




}





export default signupPage;




















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
    marginHorizontal:'4%',
    width:50,
    height:50,
    borderRadius:0,
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
