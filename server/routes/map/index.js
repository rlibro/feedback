'use strict';

var express = require('express');
var Member  = require('../../app/models/member.model');
var item    = require('../../app/models/item.model');
var react   = require('../../app/services/react.service');

var router  = express.Router();



router.get('/', react.render('Map'), function (req, res) {

  res.render('map', {
    markup: req.react.markup,
    component: req.react.component,
    props : req.react.props
  });

});

router.post('/', function(req, res) {

  res.send("test")

  
});

module.exports = router;
