/**
 * 액션 헬퍼 객체에는 Constants도 포함하고 있다. 
 * 따라서 액션을 정의할때 Constants도 수정해줘야한다.
 */

var constants = {
  OPEN_LAYER : 'OPEN_LAYER',
  HIDE_LAYER : 'HIDE_LAYER',
  LOGIN      : 'LOGIN'
};

var methods = {

  hideLayer: function(){
    this.dispatch(constants.HIDE_LAYER);
  },
  
  openLayer: function(name){
    this.dispatch(constants.OPEN_LAYER, name);
  },

  login: function(email, password){
    this.dispatch(constants.LOGIN, {email:email, password:password});
  }

};

module.exports = {
  methods: methods,
  constants: constants
}