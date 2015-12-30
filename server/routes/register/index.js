'use strict';

var express  = require('express');
var Member   = require('../../app/models/member.model');
var router   = express.Router();

function validateInput (req, res, next) {
  var validation = {
    isValidate: false,
    message: 'something is wrong!'
  };

  var isValidEmail = (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(req.body.email);

  if( !req.body.email || !req.body.password ) {
    validation.message    = 'email & password is required';
  } 

  else if( !isValidEmail ){
    validation.message    = 'email not valid';
  }

  else if( req.body.password !== req.body.confirm ) {
    validation.message    = 'confirm your password!';
  
  } else {

    validation.isValidate = true;
    validation.message = '';
  }

  req.validation = validation;
  next();

}

router.get('/', function (req, res) {

  console.log("session", req.session)

  res.render('register')

});

router.post('/', validateInput, function(req, res) {


  // 회원가입에 성공했으면, 메인페이지로 리다이렉트
  
  if( req.validation.isValidate ){

    Member.findOrCreate({
      where: {email: req.body.email},
      defaults: {name: req.body.email, password: req.body.password}
    })
    .spread(function(user, created){


      if( !created ){
        req.validation.message = '이미 가입된 메일주소('+ req.body.email+')입니다.';
        res.render('register', {error: {message: req.validation.message}})

      } else {

        req.session.user = {name: req.body.email, email: req.body.email}
        return res.redirect('/');     
      }

    });

  } else {

    // 회원가입에 실패했다면 에러메시지 출력
    res.render('register', {error: {message: req.validation.message}})

  }


  
});

module.exports = router;
