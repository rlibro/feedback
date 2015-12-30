'use strict';

var express = require('express');
var Member  = require('../../../app/models/member.model');
var router  = express.Router();

// var crypto = require('crypto');
// var moment = require('moment');
// var auth = require('../../libs/service/auth.service');

router.post('/auth', /*auth.isAuthenticated(), */ function(req, res){

  console.log(req.body);

  Member.find({
      where: {email: req.body.email}
    }).then(function (member) {

      // 일치된 사용자가 없다면 user는 null을 반환한다.
      if(member && member.authenticate(req.body.password) ) {
        
        var data = member.get({plain:true});
        data.provider = 'local';
        
        delete data.hashedPassword;
        delete data.salt;

        // 세션에서 redirect를 받아서 처리하자!
        var url = req.session.redirect || "/";
        req.session.user = data;
        
        // NOTICE: REDIS 스토어는 save 없어도 자동 저장되지만 다른 스토어는 save가 있어야 저장되므로 컨벤션에 맞춤
        req.session.save();        
        res.json({
          meta: {code: 200},
          data: data
        });

      }else{
        
        res.json({
          meta: {code:501},
          error: {
            message: "that's no no!"
          }
        });
        
      }

    });
});

router.put('/:id', /*auth.isAuthenticated(), */ function(req, res){

  console.log(req.body);

  Member
  .find({where: {id: req.params.id}})
  .then(function(member) {
    member.role = req.body.role;
    member.updatedAt = new Date();
    member.save();
    res.json(member);
  });

});

router.put('/:id/password', /*auth.isAuthenticated(), */ function(req, res){

  console.log(req.body);

  Member
  .findOne({where:{id:req.params.id}})
  .then(function(member){

    member.password = req.body.password;
    member.shouldResetPassword = false;
    member.save().then(function(){
    
      res.json({result:'OK'});  

    });

  });
});

module.exports = router;