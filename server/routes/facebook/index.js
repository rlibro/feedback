'use strict';

const express = require('express');
const router = express.Router();
const config = require('../../../config/environment');
const request = require('request');
const fb_scope = 'user_location,user_friends,email';
const fb_api_version = 'v2.5';


router.get('/login?', function(req, res) {

  const redirect = req.query.redirect;
  const redirect_url = `${config.facebook.hostname}/facebook/result&scope=${fb_scope}`;

  if( redirect ) {
    req.session.redirect = redirect;
  }

  res.writeHead(301, {
    'Cache-Control': 'no-cache',
    'Location': `https://www.facebook.com/dialog/oauth?client_id=${config.facebook.api_key}&redirect_uri=${redirect_url}`
  });
  res.end();
});

router.get('/result?', function(req, res) {

  if (req.query.code) {
    const redirect = req.session.redirect || config.facebook.hostname;
    const url = `https://graph.facebook.com/oauth/access_token?scope=${fb_scope}&client_id=${config.facebook.api_key}&redirect_uri=${encodeURIComponent(config.facebook.hostname + req.originalUrl)}&client_secret=${config.facebook.secret}&code=${encodeURIComponent(req.query.code)}`;

    request({ 
      uri: url,
      timeout: 100000
    }, function(err, resp, body) {
      
      if( err ){
        console.err('[module][facebook][error]', err);
        res.send("<!DOCTYPE html><script>window.opener.location.reload(); window.close()</script>");
        return;
      }

      const token = (require('querystring').parse(body).access_token);

      if (token) {
        
        request(`https://graph.facebook.com/${fb_api_version}/me?fields=id,name,email,location,picture{url}&access_token=${token}`, 
          function(err, resp, body) {

          if( err && err.code === 'ETIMEDOUT') { 
            res.send("<!DOCTYPE html><script>window.opener.location.reload(); window.close()</script>");
            return;
          }

          const data = JSON.parse(body);
          req.session.user = data;
          req.session.user.provider = 'facebook';
          req.session.user.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          req.session.save();

          request(`https://graph.facebook.com/${fb_api_version}/${data.location.id}?fields=location&access_token=${token}`, function(err, resp, body){

            const data = JSON.parse(body);
            req.session.user.location = data.location;
            req.session.save();

            res.send(`<!DOCTYPE html><script>window.opener.location.href='${redirect}';window.close()</script>`);


          });

          
        
        });

      } else {
        
        console.err('[module][facebook][exception] - invalid token')
        res.send("<!DOCTYPE html><script>window.opener.location.reload(); window.close()</script>");
      
      }

    });
  } 

});

module.exports = router;