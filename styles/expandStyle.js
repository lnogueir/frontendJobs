import {Dimensions,StyleSheet,Platform} from 'react-native';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

const winWidth = Dimensions.get('window').width
const winHeight = Dimensions.get('window').height


const expandStyle = StyleSheet.create({
  container:{
    flexGrow:1,
  },
  titleStyle:{
    flexDirection:'column',
    margin:5,
  },
  fontStyle:{
    fontFamily:Platform.OS =='ios'?'Avenir':null,
    paddingHorizontal:10,
    fontSize:32,
    textAlign:'center',
    fontWeight:'600'
  },
  rowView:{
    flexDirection:'row',
  },
  colLines:{
    paddingLeft:20
  },
  aboutStyle:{
    borderTopWidth:0.4,
    borderBottomWidth:0.4,
    alignItems:'center',
    justifyContent:'center',
    padding:15,
    margin:7,
  },
  aboutText:{
    fontFamily:Platform.OS =='ios'?'Avenir':null,
    fontSize:27,
    fontWeight:'300'
  },
  textStyle:{
    margin:5,
    marginHorizontal:15,
    padding:20,
    overflow:'hidden',
    backgroundColor:'whitesmoke',
    borderRadius:20,
    paddingBottom:70
  },
  applyView:{backgroundColor:'transparent',alignItems:'flex-end',flexDirection:'row',justifyContent:'space-evenly',width:'100%'},
  applyButton:{
    width:wp('70%'),
    borderRadius:30,
    backgroundColor:'#45546d',
  },
  applyTitle:{
    fontSize:25,
    fontWeight:'600',
  },
  bookmarkView:{alignItems:'center'},
  footer:{height:'2%',borderTopWidth:1,borderColor:'white'},

  floatingButt:{
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 15,
    left:15
  },
  floatingButt2:{
    position: 'absolute',
    bottom: 8,
    alignSelf:'flex-end',
    right:15,
  }

})


export default expandStyle
