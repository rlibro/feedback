/**
 * 2015 페이지 라우팅
 */
'use strict';

var express = require('express');
var router = express.Router();
var config = require('../../../config/environment');
var request = require('request');

router.get('/login?', function(req, res) {

  var redirect_url = config.facebook.hostname + '/facebook/result&scope=publish_actions,email';

  res.writeHead(301, {
    'Cache-Control': 'no-cache',
    'Location': 'https://www.facebook.com/dialog/oauth?client_id=' + config.facebook.api_key + '&redirect_uri=' + redirect_url
  });
  res.end();
});

router.get('/result?', function(req, res) {

  if (req.query.code) {
    var redirect = req.session.lastUrl || 'http://localhost:3200/';
    var url = 'https://graph.facebook.com/oauth/access_token?scope=email&client_id=' + config.facebook.api_key + '&redirect_uri=' + encodeURIComponent(config.facebook.hostname + req.originalUrl) + '&client_secret=' + encodeURIComponent(config.facebook.secret) + '&code=' + encodeURIComponent(req.query.code);

    request(url, function(err, resp, body) {
      var token = (require('querystring').parse(body).access_token);

      if (token) {
        request('https://graph.facebook.com/v2.3/me?fields=id,name,email,picture{url}&access_token=' + token, 
          function(err, resp, body) {

          var data = JSON.parse(body);
          
          req.session.user = data;
          req.session.user.provider = 'facebook';
          req.session.user.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          req.session.save();

          res.send("<!DOCTYPE html><script>window.opener.location.href = '" + redirect + "'; window.close()</script>");
        
        });
      } else { // something error happened: we just close...
        res.send("<!DOCTYPE html><script>window.opener.location.reload(); window.close()</script>");
      }
    });
  } 

});

module.exports = router;