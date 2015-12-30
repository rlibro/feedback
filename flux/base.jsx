var React = require('react');
var Fluxxor = require('fluxxor');
var actions = require('./actionCreator');
var AppStore = require('./stores/AppStore');
var AccountStore = require('./stores/AccountStore');

// 사용할 스토어
var stores = {
  AppStore: new AppStore(),
  AccountStore: new AccountStore()
};


var fluxxor = new Fluxxor.Flux(stores, actions.methods);
fluxxor.on('dispatch', function(type, payload) {

  if( console && console.log ){

    console.log("[Dispatch]", type, payload);

  }
});

var props = JSON.parse(document.getElementById("props").innerHTML);
props.flux = fluxxor;

window.React = React;
window.RedBook = {
  moment: require('moment'),
  loaded_locale: require('moment/locale/ko'),
  Search   : React.createFactory(require('./components/search/index.jsx')),
  Note     : React.createFactory(require('./components/note/index.jsx')),
  props    : props
};