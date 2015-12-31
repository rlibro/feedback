'use strict';

var auth = require('../app/services/auth.service');

module.exports = function(app) {
  app.use('/facebook', require('./facebook'));
  
  app.use('/api', require('./api'));
  
  app.get('/logout', (req, res) => {

    req.session.destroy(err => {
      console.log("destroying session");
    });

    return res.redirect('/');
  
  });

  app.use('/', require('./home'));
};