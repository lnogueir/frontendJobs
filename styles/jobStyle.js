import {Dimensions,StyleSheet,Platform} from 'react-native';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

const winWidth = Dimensions.get('window').width
const winHeight = Dimensions.get('window').height


const jobStyle = StyleSheet.create({
  container:{
    flex:1,
    height:null,
    width:null
  },
  flalistStyle:{
    width:'100%',
  },
  headerFontStyle:{
    fontFamily:Platform.OS==='ios'?'Avenir':null,
    fontWeight:'500',color:'#1968e8',
    fontSize:20,opacity:0.9
  },
  flatlistView:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    height:200,
    borderBottomWidth:2,
    borderColor:'#45546d',
    shadowOpacity:0.1,
    marginTop:5
  },
  mainColumnView:{
    flexDirection:'column',
    justifyContent:'space-evenly',
    alignItems:'flex-start',
    width:'70%',
    margin:10
  },
  jobTitle:{
    fontFamily:Platform.OS==='ios'?'Avenir':null,
    fontSize:20,
    fontWeight:'bold',
  },
  colLines:{
    paddingLeft:20
  },
  logoStyle:{
    width:10,
    height:10
  },
  colLinesTitle:{
    color:'black'
  }





})


export default jobStyle
