'use strict';

const express = require('express');
const router  = express.Router();

router.get('/', function(req, res){


  res.links({
    next: 'http://localhost/api/countries?page=2',
    last: 'http://api.example.com/users?page=5'
  });
  res.json([
    {
      'iso3': 'KOR',
      'e164': '+82',
      'e212': '450',
      'name': 'South Korea',
      'readBookCount': 2, 
      'flagImage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/45px-Flag_of_South_Korea.svg.png'
    },
    {
      'iso3': 'CUB',
      'e164': '+53',
      'e212': '368',
      'name': 'Cuba',
      'readBookCount': 4,
      'flagImage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flag_of_Cuba.svg/46px-Flag_of_Cuba.svg.png'
    },
    {
      'iso3': 'MEX',
      'e164': '+52',
      'e212': '334',
      'name': 'Mexico',
      'readBookCount': 1,
      'flagImage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/46px-Flag_of_Mexico.svg.png'  
    },
    {
      'iso3': 'USA',
      'e164': '+1',
      'e212': '310-316',
      'name': 'United States',
      'readBookCount': 1,
      'flagImage': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/46px-Flag_of_the_United_States.svg.png'
    },
    {
      'iso3': 'GTM',
      'e164': '+502',
      'e212': '704',
      'name': 'Guatemala',
      'readBookCount': 3,
      'flagImage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/46px-Flag_of_Guatemala.svg.png'
    }
  ]);

});



module.exports = router;