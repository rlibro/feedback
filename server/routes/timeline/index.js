'use strict';

var express = require('express');
var config 	= require('../../../config/environment');
var home    = require('../../app/controllers/home.controller');
var member  = require('../../app/controllers/member.controller');
var auth    = require('../../app/services/auth.service');
var react   = require('../../app/services/react.service');

var router   = express.Router();

router.get('/', react.render('TimeLine'), function(req, res){

  res.render('timeline', {
    markup: req.react.markup,
    component: req.react.component,
    props : req.react.props
  });


});

module.exports = router;
