
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
}

export default helpers;
