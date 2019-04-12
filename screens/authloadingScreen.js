import React from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

class AuthLoadingScreen extends React.Component{
  constructor(props){
    super(props);
    this._bootstrapAsync();
  }


  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userid');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    setTimeout(()=>{this.props.navigation.navigate(userToken ? 'Main': 'Login')},3000)

  };

  render(){
    return (
      <View style={{flex:1,alignItem:'center',justifyContent:'center'}}>
        <View>
            <View style={{ shadowColor:'gray',shadowOpacity:1,shadowRadius:5,
            flex:1,flexDirection:'row',justifyContent:'space-evenly',
            alignItems:'center'}}>
              <View style={[{backgroundColor:'red'},styles.innerHeaderStyle]}>
                <Text style={{color:'white', fontSize:33,fontWeight:'bold'}}>J</Text>
              </View>
              <View style={[{backgroundColor:'green'},styles.innerHeaderStyle]}>
                <Text style={{color:'white',fontSize:33,fontWeight:'bold'}}>O</Text>
              </View>
              <View style={[{backgroundColor:'blue'},styles.innerHeaderStyle]}>
                  <Text style={{color:'white',fontSize:33,fontWeight:'bold'}}>B</Text>
              </View>
            </View>
            <Button style={{marginTop:'6%'}} type='clear' loading/>
        </View>
      </View>
    );
  }

}

export default AuthLoadingScreen;

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
    // marginHorizontal:'4%',
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
  // jobTitle:{
  //   padding:10,
  //   color:'white',
  //   fontSize:22,
  //   fontWeight:'bold',
  //   width:'100%',
  //   paddingTop:5,
  //   paddingBottom:5,
  //   borderRadius:7,
  //   overflow:'hidden'
  // },
  jobInfo:{
    margin:12
  },
  jobInfoText:{
    fontSize:14,
  },
});
