import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {NavigationActions,StackActions,createStackNavigator,createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {CheckBox,ThemeProvider,Button,Header} from 'react-native-elements';
import {LinearGradient} from 'expo';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntIcon from 'react-native-vector-icons/Entypo'
// import Icon from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';


class accountPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      edit:false,
      username:'Lucasguns',
      location:'Canada, Ontario, Toronto',
      email:'lucasguns@gmail.com',
    };
  }


  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('AuthLoading');
  };



  render() {
    return(
      <View style={{flex:1, height:'100%'}}>
        <View style={{height:'20%',shadowColor:'gray',shadowOpacity:1,shadowRadius:5
        ,flexDirection:'row',justifyContent:'space-evenly',
        alignItems:'center'}}>
          <View style={[{backgroundColor:'red'},styles.innerHeaderStyle]}></View>
          <View style={[{backgroundColor:'green'},styles.innerHeaderStyle]}></View>
          <View style={[{backgroundColor:'blue'},styles.innerHeaderStyle]}></View>
        </View>
        <View>
          <CheckBox textStyle={{fontSize:25,color:this.state.edit?"#397af8":"orange"}} checkedTitle="Save Info" fontFamily='Avenir'
          center onPress={()=>this.setState({edit:!this.state.edit})}
          uncheckedIcon={<EntIcon name='edit'color="orange" size={30}/>}
          checkedIcon={<EntIcon name='save'color="#397af8" size={30}/>}
          checked={this.state.edit} title="Edit Info"
          />
        </View>
        <View style={styles.entries}>
          <View style={{marginTop:'3%'}}>
             <Text style={{margin:5,fontSize:23}}><Icon name='user-circle' color='black' size={30}/> Username: </Text>
             <TextInput
             clearButtonMode={this.state.edit?'always':'never'}
             style={{height:40,borderWidth:2,borderColor:'gray',width:250,padding:7}}
             editable={this.state.edit}
             autoFocus={this.state.edit}
             placeholder='Username'
             onChangeText={(text) => this.setState({username:text})}
             value={this.state.username}
             />
          </View>
          <View style={{marginTop:'3%'}}>
               <Text style={{margin:5,fontSize:23}}><MatIcon name='email' color='black' size={30}/> Email:  </Text>
               <TextInput
               clearButtonMode={this.state.edit?'always':'never'}
               editable={this.state.edit}
               // autoFocus={this.state.edit}
               style={{height:40,borderWidth:2,borderColor:'gray',width:250,padding:7}}
               placeholder='example@email.com'
               onChangeText={(text) => this.setState({email:text})}
               value={this.state.email}
               />
          </View>
          <View style={{marginTop:'3%'}}>
               <Text style={{margin:5,fontSize:23}}><MatIcon name='map-marker-radius' color='black' size={30}/> Job City:  </Text>
               <TextInput
               clearButtonMode={this.state.edit?'always':'never'}
               // autoFocus={this.state.edit}
               editable={this.state.edit}
               underlineColorAndroid='gray'
               style={{height:40,borderWidth:2,borderColor:'gray',width:250,padding:7}}
               placeholder='Canada, Ontario, Toronto'
               onChangeText={(text) => this.setState({location:text})}
               value={this.state.location}
               />
           </View>
          <Button style={{marginTop:'5%'}} iconRight icon={<Icon name="chevron-right" color="#397af8" size={30}/>} type="clear" title="Change Password   "/>
          <Button style={{marginTop:'8%'}} type="outline" icon={<SLIcon name="logout" color="#397af8" size={33}/>} onPress={()=>{this._signOutAsync()}} title='   Sign out'/>
        </View>
      </View>
    );
  }



}

export default accountPage;



const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column',
    alignItems:"center",
    justifyContent:"center",
  },
  entries:{
    height:'12%',
    marginRight:'15%',
    marginLeft:'15%',
    flexDirection:'column'
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
  row:{flex:1,
    lineHeight:15,
    paddingVertical:25,
    paddingHorizontal:15,
    flexDirection:'row',
    justifyContent:'space-evenly',
    borderBottomWidth:1,
    borderColor:'white'},
});
