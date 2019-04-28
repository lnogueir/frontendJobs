import {Dimensions,StyleSheet,Platform} from 'react-native';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

const winWidth = Dimensions.get('window').width
const winHeight = Dimensions.get('window').height

const searchHomeStyle = StyleSheet.create({
  container:{
    flexGrow:1,
    justifyContent:'space-around'
  },
  searchView:{
    alignItems:'center',
    justifyContent:'center',

    // borderBottomWidth:1,
    // borderColor:'gray',
  },
  input:{
    height:45,
    width:wp('85%'),
    borderRadius:25,
    backgroundColor:'#e5e7ea',
    marginHorizontal:25,
    fontSize:20,
    paddingLeft:45,
    zIndex:1
  },
  textIn:{
    padding:7,paddingLeft:25,fontSize:15
  },
  outsideInput:{
    width:wp('85%'),
    // borderRadius:25,
    backgroundColor:'#e5e7ea',
    marginHorizontal:25,
  },
  insideInput:{
    fontSize:20,
    paddingLeft:45,
  },
  icon:{
    position:'absolute',
    top:7,
    left:37,
    zIndex:3
  },
  searchButton:{
    borderRadius:30,
    backgroundColor:'blue',
    marginHorizontal:25,
    width:wp('65%'),
    margin:20
  },
  searchButTitle:{
    fontFamily:Platform.OS=='ios'?'Avenir':null,
    fontWeight:'bold',
    color:'white',
    fontSize:23
  },
  recomendations:{
    margin:10,
    flexDirection:'column',
  },
  recommendTitle:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start'
  },
  recommendedText:{
    fontFamily:Platform.OS=='ios'?'Avenir':null,
    fontSize:24,
    fontWeight:'600',
    // paddingLeft:15,
    lineHeight:40,
  },
  emptyShortlist:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  emptyText:{
    fontFamily:Platform.OS=='ios'?'Avenir':null,
    fontSize:23,
  }


})


export default searchHomeStyle
