'use strict';
const express = require('express');
const router  = express.Router();
//const cities = require('../../../countriesToCities.json');

function mainRoute(req, res){

  console.log('==> params', req.params, req.originalUrl);

  const state = {
    login: req.session.user || {}
  }  

  res.render('index', {state: JSON.stringify(state)});
  return;
}


router.get('/', mainRoute);
router.get('/redbooks/:uname', function(req, res){
 
  const login = req.session.user;
  const names = req.params.uname.replace(/_/g,' ').split(',');

  if( !login || !names || names.length !== 2 ){
    return res.redirect('/');
  }

  const state = {
    login: req.session.user || {},
    newRedBook : {
      cityName : names[0],
      countryName: names[1]
    }
  } 

  res.render('index', {state: JSON.stringify(state)});

});
router.get('/:redBookId', mainRoute);
router.get('/:redBookId/:noteId', mainRoute);

module.exports = router;
