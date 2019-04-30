import {Dimensions,StyleSheet,Platform} from 'react-native';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

const winWidth = Dimensions.get('window').width
const winHeight = Dimensions.get('window').height


const accountStyle = StyleSheet.create({
  container:{
    flex:1,
  },
  headerFontStyle:{
      fontFamily:Platform.OS==='ios'?'Avenir':null,
      fontWeight:'500',color:'#1968e8',
      fontSize:20,opacity:0.9
  },
  profileInfoView:{
    flexDirection:'column',
    justifyContent:'space-evenly'
  },
  accountInfoTitle:{
    fontFamily:Platform.OS=='ios'?'Avenir':null,
    fontSize:32,
    fontWeight:'700',
    padding:15
  },
  inputStyle:{
    padding:10
  },
  containerStyle:{
    paddingHorizontal:25,
    // width:wp('100%')
  },
  buttonStyle:{
    margin:20,
    width:wp('75%'),
    borderRadius:30,
    alignSelf:'center'
  },
  buttonTitleStyle:{
    fontFamily:Platform.OS=='ios'?'Avenir':null,
    fontSize:20,
    fontWeight:'bold'
  },
  notificationsView:{
    flexDirection:'column',
    margin:10,
    justifyContent:'space-evenly'
  },
  logoutView:{alignItems:'center',height:hp('12%'),width:wp('100%'),justifyContent:'center'},
  buttonContainer:{
    width:wp('45%'),
    borderColor:'black'
  },
  icon:{
    position:'absolute',
    top:7,
    left:37,
    zIndex:3
  },
  outsideInput:{
    backgroundColor:'#e5e7ea',
    marginHorizontal:25,
  },
  input:{
    borderBottomWidth:1,borderColor:'gray',
    height:45,
    marginHorizontal:25,
    fontSize:20,
    paddingLeft:55,
    padding:10
  },
  textIn:{
    padding:7,paddingLeft:25,fontSize:15
  },
  listItemStyle:{
    // width:wp('85%')
    padding:25
  },
  listItemTitle:{fontWeight:'600',fontFamily:Platform.OS=='ios'?'Avenir':null,fontSize:20},
  overlayTitle:{color:'white',fontFamily:'Avenir',fontSize:23,fontWeight:'600',lineHeight:40},

})

export default accountStyle
