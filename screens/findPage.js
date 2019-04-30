import React, {Component} from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,AppRegistry,ScrollView,Text,
  View,Image} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {SearchBar,ThemeProvider,Button,Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import IP from '../constants/IP.js';
import jobStyle from '../styles/jobStyle.js'

class findPage extends React.Component{
  constructor(props){
    super(props);
    arrayHolder=[]
    _isMounted = false
    this.state={
      userid:'',
      prevPageSize:-1,
      display:true,
      key:this.props.navigation.getParam('searchKey',null),
      location:this.props.navigation.getParam('location', null),
      searchData:[],
      refreshing:false,
      page:1,
      shortlist:[],
      waiting:[]
    };
    this.isGuest();
  }




  static navigationOptions = ({navigation}) => {
    const search = navigation.getParam('searchKey',null)==null||navigation.getParam('searchKey',null)==''?navigation.getParam('location'):navigation.getParam('searchKey');
    // console.log(search)
    return {
      headerLeft:<Button onPress={()=>navigation.navigate('Home')} title='Search' type='clear' icon={<Icon name='chevron-left' color='#397af8' size={20}/>}/>,
      title: 'Results for "'+search+'":',
      headerRight: <Image
        style={{width:40,height:46}}
        source={require('../assets/PlanetJobLogo.png')}
      />
    }
  }

  isGuest = async () => {
      const value = await AsyncStorage.getItem('userid');
      // console.log(value==null);
      this.setState({guest:value==null})
      if(!this.state.guest){
        this.getUserid()
      }else{
        this.populateSearch()
      }
}



  getUserid = async () => {
   try {
     const value = await AsyncStorage.getItem('userid');
     if (value !== null) {
       this.setState({userid:value})
       this.populateSearch()
     }
   } catch (error) {
     // Error retrieving data
   }
 };

  // populateSearch = (index) => { //HOW TO LOOP THROUGH ASYNC CALLS
  //   let url = "http://10.36.51.13:3000/api/searches?q="+this.state.key+"&category=generic&page="+index.toString();
  //   fetch(url)
  //   .then((response)=>response.json())
  //   .then((responseJson)=>{
  //     if(responseJson.jobs.length!=0){
  //       this.setState({display:true,searchData:this.state.searchData.concat(responseJson.jobs)});
  //       this.populateSearch(index+1);
  //     }else if(this.state.searchData==0){
  //       this.setState({display:false});
  //     }
  //   })
  // }


    componentDidMount = () => {
      this._isMounted = true
    }

    componentWillUnmount = () => {
      this._isMounted = false
    }

    toShortlist = async (jobId) => {
      let userData = {
         jobID:jobId,
         userID:this.state.userid
       }
       var url = IP+':3000/api/Shortlists/addShortList'
       try{
         let response = await fetch(url,{
           method:'POST',
           headers:{
             'Accept':'application/json',
             'Content-Type':'application/json',
           },
           body:JSON.stringify(userData)
         });
         let responseJson = await response.json();
         if(responseJson.error!=undefined){
           alert("Sorry, something went wrong")

         }else{
           this.setState({shortlist:[...this.state.shortlist,jobId]})
         }
         this.setState({waiting:this.state.waiting.map((entry)=>{return false})})
         return responseJson.result;
       }catch(error){
         console.log(error)
       }
    }

    populateShortlist = async () => {
      let url = IP+':3000/api/Shortlists/userID?q='+this.state.userid;
      await fetch(url)
      .then((response)=>response.json())
      .then((responseJson)=>{
          let url = IP+':3000/api/job-posts/jobsArray'
          try{
              this.timer = fetch(url,{
              method:'POST',
              headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
              },
              body:JSON.stringify(responseJson.jobsforUserID)
            }).then((jobResponse)=>jobResponse.json())
              .then((finalResponse)=>{
                if(this._isMounted){
                  this.setState({shortlist:finalResponse.jobs.map(job=>{return job[0].id}),waiting:this.state.waiting.map((entry)=>{return false})})
                 }
              })
            return responseJson.result;
          }catch(error){
            console.log(error)
          }
        }
      );
    }


    populateSearch = async () => {
      let url = (this.state.location==null||this.state.location=='')
      ?
      IP+":3000/api/searches?q="+this.state.key+"&category=generic&page="+this.state.page+"&userID="+this.state.userid
      :
      (this.state.key==null||this.state.key=='')
      ?
      IP+":3000/api/searches?q="+this.state.location.split(', ')[0]+"&category=location&page="+this.state.page
      :
      IP+":3000/api/searches?q="+this.state.key+"&category=generic&page="+this.state.page+"&location="+this.state.location.split(', ')[0]+"&userID="+this.state.userid
      // console.log(url)
      await fetch(url)
      .then((response)=>response.json())
      .then((responseJson)=>{
        // console.log(responseJson)
        if(responseJson.jobs.length!=0){
          this.setState(state=>({display:true,prevPageSize:responseJson.jobs.length,
          searchData:this.state.searchData.concat(responseJson.jobs)}));
          this.setState({waiting:new Array(this.state.searchData.length).fill(false)})
          if(!this.state.guest){
              this.populateShortlist()
          }
        }else{
          if(this.state.searchData.length==0){
            this.setState({display:false});
          }
        }
      })
    }

  infiniteScrollSearch = () => {
      if(this.state.searchData.length!=0){
        this.setState(state=> ({page:this.state.page+1}), () => this.populateSearch());
      }
  }


  getDaysPosted = (date) => {
    var curDate = new Date(Date())
    var postedDate = new Date(date)
    var days = (curDate - postedDate)/(1000*60*60*24);
    return days
  }

  searchFilter = (text) => {
   if(text){
     const newData = this.arrayHolder.filter(item => {
       const itemData = `${item[0].title.toUpperCase()}
       ${item[0].location.toUpperCase()} ${item[0].company.toUpperCase()}`;
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
     });
     this.setState({ shortlist: newData,search:text });
   }else{
     this.setState({ shortlist: this.arrayHolder,search:text , isTyping:false});
   }
  }

  isJobInShortlist = (id) => {
    return this.state.shortlist.includes(id)
  }

  deleteShortlist = async (jobId,clearAll) =>{
    let shortlistInfo={};
    if(!clearAll){
      shortlistInfo.userID = this.state.userid
      shortlistInfo.jobID = jobId
    }else{
         shortlistInfo.userID=this.state.userid
    }
    if(this.state.shortlist.length!=0){
     var url = IP+':3000/api/Shortlists/deleteShortList'
     try{
       let response = await fetch(url,{
         method:'DELETE',
         headers:{
           'Accept':'application/json',
           'Content-Type':'application/json',
         },
         body:JSON.stringify(shortlistInfo)
       });
       let responseJson = await response.json();
       if(responseJson.error==undefined){
           this.populateShortlist()
       }else{
         alert("Sorry, something went wrong")
       }
       return responseJson.result;
     }catch(error){
       console.log(error)
     }
   }else{
     alert("Shortlist is empty.")
   }
  }




  render(){
    // this.populateShortlist()
    if(this.state.display){
    return (
      <View style={jobStyle.container}>
        <NavigationEvents
          onWillFocus={payload=>{
            if(this._isMounted && !this.state.guest){
              this.populateShortlist()
            }
          }}
        />
        <SearchBar
          lightTheme
          containerStyle={{backgroundColor:'#e5e7ea',borderColor:'transparent'}}
          inputContainerStyle={{backgroundColor:'white'}}
          placeholder='Filter results'/>
        <FlatList
          onEndReached={()=>this.infiniteScrollSearch()}
          onEndReachedThreshold={0}
          data={this.state.searchData}
          ListFooterComponent={() => this.state.prevPageSize!=15 ? null : <ActivityIndicator size='large' animating/>}
          keyExtractor={(item,index) =>index.toString()}
          style={jobStyle.flalistStyle}
          renderItem={({item,index}) => (
          <TouchableHighlight
            underlayColor='white'
            onPress = {()=>this.props.navigation.push('expandJob',{job:item,userid:this.state.userid})}
          >
          <View style={jobStyle.flatlistView}>
            <View style={jobStyle.mainColumnView}>
              <Text style={jobStyle.jobTitle}>{item.title}</Text>
              <Button
              disabledTitleStyle={jobStyle.colLinesTitle}
              icon={<MatIcon name='business' color='#45546d' size={20}/>}
              disabledStyle={jobStyle.colLines}
              disabled type='clear' title={item.company}
              />
              <Button
              disabledTitleStyle={jobStyle.colLinesTitle}
              icon={<MatIcon name='location-on' color='#45546d' size={20}/>}
              disabledStyle={jobStyle.colLines}
              disabled type='clear' title={item.location}
              />
              <Button
              disabledTitleStyle={jobStyle.colLinesTitle}
              icon={<MatIcon name='monetization-on' color='#45546d' size={20}/>}
              disabledStyle={jobStyle.colLines}
              disabled type='clear' title={item.salary}
              />
              <View style={{flexDirection:'row'}}>
                <Button icon={<MatIcon name='query-builder' color='lightgray' size={15}/>}
                disabled disabledTitleStyle={{fontSize:14}}
                disabledStyle={{paddingRight:30,alignSelf:'auto'}}
                type='clear' title={Math.floor(this.getDaysPosted(item.date_post))>1?(Math.floor(this.getDaysPosted(item.date_post))==1?' 1 day ago':' '+ Math.floor(this.getDaysPosted(item.date_post))+' days ago'):' Today'}
                />
              </View>
            </View>
            <Button
            type='clear'
            onPress ={() => {
                    // console.log(this.isJobInShortlist(item.id))
                    // console.log(this.state.shortlist)
                    if(!this.state.guest){
                        this.setState({waiting:this.state.waiting.map((entry,i)=>{return i==index?true:false})})
                        console.log(this.state.waiting)
                        if(this.isJobInShortlist(item.id)){
                            this.deleteShortlist(item.id,false)
                        }else{
                            this.toShortlist(item.id)
                        }
                    }else{
                        alert("You must create an account in order to have a shortlist.")
                    }
                    }}
             // loading={this.state.waiting[index]}
             icon={<MatIcon name={this.state.guest?'bookmark-border':this.state.waiting[index]?(this.isJobInShortlist(item.id)?'exposure-neg-1':'exposure-plus-1'):this.isJobInShortlist(item.id)?'bookmark':'bookmark-border'} color='black' size={50}/>}
             // icon={<MatIcon name={this.isJobInShortlist(item.id)?'bookmark':'bookmark-border'} color='black' size={50}/>}
            />
          </View>
          </TouchableHighlight>
          )}
        />
      </View>
    );
  }
  else{
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{marginHorizontal:15,fontSize:40,fontWeight:'bold'}}>Sorry, no results have been found.{'\n'}</Text>
        <Icon
        name="frown-o"
        color='black'
        size={250}
        />
      </View>
    );
  }
  }
}

export default findPage;
