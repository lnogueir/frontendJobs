import {Dimensions,StyleSheet,Platform} from 'react-native';
import {widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';



const notificationPageStyle = StyleSheet.create({
  row:{flex:1,
    paddingVertical:25,
    paddingHorizontal:15,
    flexDirection:'row',
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderColor:'white'
  },
  textStyle:{
    fontSize:17,
    lineHeight:40,
    fontFamily:Platform.OS=='ios'?'Avenir':'Nunito'
  },
  switchStyle:{
    lineHeight:40,
  },
  container: {backgroundColor:'#fff',
  flex:1,
},
mainView:{flexDirection:'column',height:hp('40%')}
})

export default notificationPageStyle;
