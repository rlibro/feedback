var Fluxxor = require('fluxxor');
var actions = require('../actionCreator.js');
var $ = require('jquery');

var AccountStore = Fluxxor.createStore({

  // Fluxxor 에서 자동으로 호출한다.
  initialize : function(){
  
    this.state = {
      user: null,
      isLoginLayerOpened: false,
      message: ''
    };


    // 외부에서 받은 액션(메시지) 처리
    this.bindActions(
      actions.constants.OPEN_LAYER, this.onOpenLoginLayer,
      actions.constants.HIDE_LAYER, this.onHideLoginLayer,
      actions.constants.LOGIN, this.onLogin
    );

  },

  // 서버로부터 로그인 정보가 내려오기 때문에 강제로 스토어의 상태값을 설정할 필요가 있다.
  setState: function(user){
    this.state.user = user;
  },

  getState: function(){
    return this.state;
  },

  onHideLoginLayer: function(){

    this.state.isLoginLayerOpened = false;
    this.emit('change');

  },

  onOpenLoginLayer: function(name){

    if( name === 'login') {
      this.state.isLoginLayerOpened = true;
    }
    this.emit('change');
  },

  onLogin: function(user){

    var self = this;

    $.ajax({
      type: 'POST',
      url : '/api/members/auth',
      data: {
        email: user.email,
        password : user.password
      }
    }).done(function(res){
      
      if(res.meta.code === 200) {
        
        self.state.user = res.data;
        self.state.isLoginLayerOpened = false;
        
      }else{
      
        self.state.message = res.error.message;        
      
      }

      self.emit("change");


    }).fail(function(res){
    
      self.state.message = "네트워크에 문제가 있습니다.";
      self.emit("change");
    
    });

  }

});

module.exports = AccountStore;