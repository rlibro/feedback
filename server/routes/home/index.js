'use strict';
const express = require('express');
const router  = express.Router();
const cities = require('../../../countriesToCities.json');

function mainRoute(req, res){

  console.log('==> params', req.params, req.originalUrl);

  const state = {
    login: req.session.user || {}
  }  

  res.render('index', {state: JSON.stringify(state)});
  return;
}


router.get('/', mainRoute);
router.get('/redbooks/:countryName', function(req, res){
 
  const countryName = req.params.countryName.replace(/_/g, ' ');
  const state = {
    login: req.session.user || {},
    newRedBook : {
      countryName: req.params.countryName,
      cities: cities[countryName]
    }
  } 

  res.render('index', {state: JSON.stringify(state)});

});
router.get('/:redBookId', mainRoute);
router.get('/:redBookId/:noteId', mainRoute);

module.exports = router;
