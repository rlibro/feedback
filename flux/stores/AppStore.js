var Fluxxor = require('fluxxor');
var actions = require('../actionCreator.js');
var $ = require('jquery');

var AppStore = Fluxxor.createStore({

  initialize : function(){
  
    this.options = {
      user: null,
      isSignInOpened : false,
      isSignUpOpened : false,
      isTryingAuth   : false
    }

    // this.bindActions(
    //   actions.constants.SIGNIN_LAYER, this.onDisplaySignInLayer,
    //   actions.constants.SIGNUP_LAYER, this.onDisplaySignUpLayer,
    //   actions.constants.HIDE_LAYER, this.onHideLayer,
    //   actions.constants.SIGNIN, this.onSignIn
    // );

  },

  setUser: function(user){
    this.options.user = user;
  },

  onSignIn: function(user){

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
        
        self.options.user = res.data;
        self.options.isSignInOpened = false;  
        self.options.isSignUpOpened = false;
        
      }else{
      
        self.options.message = res.error.message;        
      
      }

      self.options.isTryingAuth = false;
      self.emit("change");


    }).fail(function(res){
    
      self.options.message = "네트워크에 문제가 있습니다.";
      self.emit("change");
    
    });
    this.options.isTryingAuth = true; 
    this.emit("change");
  },

  onHideLayer: function(){
    this.options.isSignInOpened = false;  
    this.options.isSignUpOpened = false;

    this.emit("change");
  },

  onDisplaySignInLayer: function(flag){
    if(flag === 'show'){
      this.options.isSignInOpened = true;    
      this.options.isSignUpOpened = false;

    }else {
      this.options.isSignInOpened = false;
    }
    
    this.emit("change");
  },

  onDisplaySignUpLayer: function(flag){
    if(flag === 'show'){
      this.options.isSignUpOpened = true;
      this.options.isSignInOpened = false;  
    }else {
      this.options.isSignUpOpened = false;
    }
    
    this.emit("change");
  },

  getState: function(){

    return this.options
    
  }

});

module.exports = AppStore;