<View style={{height:'20%',shadowColor:'gray',shadowOpacity:1,shadowRadius:5
,flexDirection:'row',justifyContent:'space-evenly',
alignItems:'center'}}>
  <View style={[{backgroundColor:'red'},styles.innerHeaderStyle]}></View>
  <View style={[{backgroundColor:'green'},styles.innerHeaderStyle]}></View>
  <View style={[{backgroundColor:'blue'},styles.innerHeaderStyle]}></View>
</View>
<View>
  <CheckBox checked={this.state.notifications} title='Enable Notifications'
  onPress={()=>{
    if(!this.state.notifications){
      this.allowNotifications()
    }else{
      this.unallowNotifications()
    }
    this.setState({notifications:!this.state.notifications})
  }}/>
  <CheckBox textStyle={{fontSize:25,color:this.state.edit?"#397af8":"orange"}} checkedTitle="Save Changes"
  center onPress={()=>{
    if(this.state.edit){
      this.editUserInfo();
    }
    this.setState({edit:!this.state.edit})
  }}
  uncheckedIcon={<EntIcon name='edit'color="orange" size={30}/>}
  checkedIcon={<EntIcon name='save'color="#397af8" size={30}/>}
  checked={this.state.edit} title="Edit Info"
  />
</View>
<KeyboardAvoidingView behavior='padding' style={{flex:1,justifyContent:'space-between'}}>
<View style={styles.entries}>
       <Text style={{margin:5,fontSize:23}}><MatIcon name='map-marker-radius' color='black' size={30}/> Job City:  </Text>
       <Autocomplete
          containerStyle={{width:wp('65%'),height:hp('5%')}}
          autoCorrect={false}
          inputContainerStyle={{paddingLeft:5, borderColor:'gray',borderWidth:2}}
          returnKeyType={'done'}
          clearButtonMode={this.state.edit?'always':'never'}
          editable={this.state.edit}
          data={this.state.predictions}
          defaultValue={this.state.location}
          onChangeText={text => this.onChangeDestJOB(text)}
          placeholder='City, Province, Country'
          renderItem={({ loc }) => (
             <Text style={{padding:7}} onPress={() => this.setState({ location: loc,predictions:[] })}>
               {loc}
             </Text>
           )}
         />
       <Text style={{margin:5,fontSize:23}}><Icon name='user-circle' color='black' size={30}/> Username: </Text>
       <TextInput
       returnKeyType={'done'}
       clearButtonMode={this.state.edit?'always':'never'}
       style={{height:hp('5%'),borderWidth:2,borderColor:'gray',width:wp('65%'),padding:7}}
       editable={this.state.edit}
       autoFocus={this.state.edit}
       placeholder='Username'
       onChangeText={(text) => this.setState({username:text})}
       value={this.state.username}
       />
       <Text style={{margin:5,fontSize:23}}><MatIcon name='email' color='black' size={30}/> Email:  </Text>
       <TextInput
       returnKeyType={'done'}
       clearButtonMode={this.state.edit?'always':'never'}
       editable={this.state.edit}
       // autoFocus={this.state.edit}
       style={{height:hp('5%'),borderWidth:2,borderColor:'gray',width:wp('65%'),padding:7}}
       placeholder='example@email.com'
       onChangeText={(text) => this.setState({email:text})}
       value={this.state.email}
       />
    <Button style={{marginTop:'5%'}} iconRight icon={<Icon name="chevron-right" color="#397af8" size={30}/>} type="clear" title="Change Password   "/>
  <Button style={{marginTop:'8%'}} type="outline"
  icon={<SLIcon name="logout" color="#397af8" size={33}/>}
  onPress={()=>{
  if(this.state.edit){
      this.callAlertLogout()
  }else{
      this._signOutAsync()
  }

  }}
  title='   Sign out'/>
</View>
</KeyboardAvoidingView>
