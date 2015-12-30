'use strict';
var debug = require('debug')('react.service');
var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var RootComs = {
  'Search'   : React.createFactory(require('../../../flux/components/search/index.jsx')),
  'Note'     : React.createFactory(require('../../../flux/components/note/index.jsx'))
};
var actions = require('../../../flux/actionCreator').methods;
var AppStore = require('../../../flux/stores/AppStore');
var AccountStore = require('../../../flux/stores/AccountStore');

// 사용할 스토어
var stores = {
  AppStore: new AppStore(),
  AccountStore: new AccountStore()
};

var fluxxor = new Fluxxor.Flux(stores, actions);

   
function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}


var reactService = {

  render : function(componetName){

    // 인증되지 않았다면 로그인(signin)인 먼저 하도록 유도한다.  
    // 따라서 로그인 페이지로 넘기되, redirect 옵션을 준다.   
    return function(req, res, next){

      var props = {user: req.session.user};
      var component = RootComs[componetName];
      var propsWithFlux = _.extend({flux: fluxxor}, props);
      var markup = React.renderToString(component(propsWithFlux));


      req.react = {
        markup : markup,
        component : componetName,
        props: safeStringify(props)
      }

      next();

    }
  }
}



module.exports = reactService;