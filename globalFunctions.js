import AsyncStorage from 'react-native';

const helpers={
  getGradientColor:function helper1(index){
    if(index%3==0){
      return '#edc7c9';
    }
    if(index%3==1){
      return 'lightgreen';
    }
    if(index%3==2){
      return 'lightblue'/*'#5f94ef'*/;
    }
  },
  getBackgroundColor:function helper2(index){
    if(index%3==0){
      return 'red';
    }
    if(index%3==1){
      return 'green';
    }
    if(index%3==2){
      return 'blue';
    }
  },
  isGuest: async function herlper3(){
    try {
      const value = await AsyncStorage.getItem('userid');
      // console.log(value==null);
      console.log(value)
      return value==null;
      // GUEST = value==null;
    } catch (error) {
      // Error retrieving data
    }
  },
  capitalize: function helper4(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  getToken:async function helper5() {
  // Remote notifications do not work in simulators, only on device
  if (!Expo.Constants.isDevice) {
    return;
  }
  let { status } = await Expo.Permissions.askAsync(
    Expo.Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    return;
  }
  let value = await Expo.Notifications.getExpoPushTokenAsync();
  console.log('Our token', value);
  /// Send this to a server
}


}

export default helpers;
