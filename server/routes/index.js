'use strict';

var auth = require('../app/services/auth.service');

module.exports = function(app) {
  app.use('/facebook' , require('./facebook'));
  app.use('/'         , require('./home'));
  // app.use('/register' , require('./register'));
  // app.use('/backpack' , require('./timeline'));
  // app.use('/note'     , require('./note'));
  // app.use('/map'      , require('./map'));
  app.use('/api'      , require('./api'));

  app.get('/logout', function(req, res) {

    req.session.destroy(function(err) {
      console.log("destroying session");
    });
    return res.redirect('/');
  });

};