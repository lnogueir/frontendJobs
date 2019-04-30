import {Dimensions,StyleSheet,Platform} from 'react-native';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

const winWidth = Dimensions.get('window').width
const winHeight = Dimensions.get('window').height

const loginStyle=StyleSheet.create({
    container:{
      flex:1,
      height:null,
      width:null,
    },
    headerContainer:{
      width:wp('100%'),
      backgroundColor:'#1968e8',
    },
    headerFontStyle:{
      fontFamily:Platform.OS==='ios'?'Avenir':null,
      fontWeight:'500',color:'white',
      fontSize:20,opacity:0.9
    },
    logoContainer:{
      flex:20,
      width:'100%',
      alignItems:'center',
      justifyContent:'center'
    },
    logoStyle:{
      width:200,
      height:200,
    },
    inputView:{
      flex:14,
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'space-evenly'
    },
    inputStyle:{
      padding:10
    },
    containerStyle:{
      width:wp('90%')
    },
    buttonViewLogin:{
    marginBottom:25,
    flex:14,
    width:wp('100%'),
    flexDirection:'column',
    justifyContent:'space-evenly',
    alignItems:'center'
},
  orStyle:{marginVertical:15,alignSelf:'center',color:'gray',fontSize:19},

  buttonsStyle:{borderRadius:30,
    width:wp('70%')},

  buttonFontStyle:{fontFamily:Platform.OS==='ios'?'Avenir':null,fontWeight:'bold',fontSize:25},

  forgotStyle:{
    fontFamily:Platform.OS=='ios'?'Avenir':null,
    fontWeight:'500',
    fontSize:20,
    color:'#45546d'
  },
  guest:{
    fontSize:17,
    fontFamily:Platform.OS=='ios'?'Avenir':null,
    color:'gray',
  }








})





export default loginStyle
