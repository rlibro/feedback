'use strict';
var React = require('react');
var Post  = require('../models/story.model');
var debug = require('debug')('server:controller:home');
var _     = require('lodash');


exports.index = function(req, res, next) {
  
  req.react = {
    component : 'TimeLine',
    props: {
      user: req.session.user,
    }
  }
  next();

};

exports.signout = function(req, res) {

  req.session.destroy(function(err) {
    console.log("destroying session");
  });
  return res.redirect('/');
};