/**
 * 세션에 정보를 저장하는 미들웨어
 */
'use strict';
var _ = require('lodash');
var debug = require('debug')('mw:SESSION');
//var Member = require('../../app/models/member.model');

module.exports = function(req, res, next){

  debug("\n", req.session);
  var user = req.session.user;

  // 페북으로 연결할 경우 정보를 페북에서 가져와 DB에 기록하고, 
  // 반대로 필요한 정보를 DB에서 가져와 세션에 기록한다. 
  if( user && user.provider === 'facebook' ) {
    // Member.findOrCreate({
    //   where: { email: user.email }, 
    //   defaults: {
    //     name          : user.name, 
    //     email         : user.email,
    //     createdAt     : new Date(), 
    //     lastLoggedAt  : new Date() 
    //   }
    // })
    // .spread(function(user, created){

    //   var email = user.email;
      
    //   // 기존에 저장된 값이 있다면,   
    //   if( !created ){

    //     // DB에 마지막 로그인을 기록하고,
    //     user.lastLoggedAt = new Date();
    //   }

    //   req.session.user = user.get({plain:true})
    //   user.save();

      //res.locals.user = JSON.stringify({login:user});

      return next();


   // });

  }else{

    //개발을 위해 로그인 세션 정보를 강제로 저장해둔다.
    // req.session.user = { 
    //   id: '10153031949693302',
    //   name: 'ByungDae Sohn',
    //   email: 'miconblog@gmail.com',
    //   picture: { data: { url: 'https://scontent.xx.fbcdn.net/hprofile-xap1/v/t1.0-1/p50x50/1510494_10151938283373302_404117394_n.jpg?oh=14fb9c1fcd97aa23810499900f48b57b&oe=5719336B' } },
    //   provider: 'facebook',
    //   ip: '::1' 
    // };

    res.locals.user = JSON.stringify({});
    next();    
  }

 
}