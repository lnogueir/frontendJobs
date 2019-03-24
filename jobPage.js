import * as React from 'react';
import {String, TouchableOpacity, Image, FlatList,Text, View, StyleSheet,Linking} from 'react-native';
import { Constants } from 'expo';
import backend from 'backend.json';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default class jobPage extends React.Component {

  _handlePress = () => {
    Linking.openURL(this.props.href);
    this.props.onPress && this.props.onPress();
  };


render(){
    return (
      <View style={styles.container}>
        <Text style={{fontSize:40, fontWeight:'bold'}}> Jobs available: </Text>
        <FlatList
        data={backend}
        style={{width:'100%'}}
        keyExtractor={(item,index) =>index.toString()}
        renderItem={({item,separator}) => (
        <View style={{borderBottomWidth:1, borderTopWidth:1}}>
          <Text style={{fontSize:30}}> {item.title} </Text>
          <Text style={{paddingLeft:40, fontWeight:'bold'}}>Company:</Text><Text style={{paddingLeft:40,display:'inline'}}>{item.company}</Text>
          <Text style={{paddingLeft:40, fontWeight:'bold'}}>Location:</Text><Text style={{paddingLeft:40}}>{item.location}</Text>
          <Text style={{paddingLeft:40,fontWeight:'bold'}}>Salary:</Text><Text style={{paddingLeft:40}}>{item.salary}</Text>
          <Text style={{paddingLeft:40,fontWeight:'bold'}}>Summary:</Text><Text style={{paddingLeft:40}}>{item.summary}</Text>
          <TouchableOpacity style={{color:"blue", textDecorationLine:'underline'}} onPress={()=>Linking.openURL(<String name={item.href}>{item.href}</String>)}>
          <Text style={{color:"blue", textDecorationLine:"underline", paddingLeft:40}}>
          Link to employer
          </Text>
          </TouchableOpacity>

        </View>)}
        />


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
