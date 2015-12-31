'use strict';

const express = require('express');
const router  = express.Router();

router.get('/', function(req, res){


  res.links({
    next: 'http://localhost/api/redbooks?page=2',
    last: 'http://localhost/api/redbooks?page=2'
  });
  res.json([
    {
      id: 1,
      uid: 'Seoul-South_Korea',
      countryId: 1,
      countryName: 'South_Korea',
      cityName: 'Seoul',
      cityImage: '',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 100
    },
    {
      id: 2,
      uid: 'Quetzaltenango-Guatemala',
      countryId: 2,
      countryName: 'Guatemala',
      cityName: 'Quetzaltenango',
      cityImage: '',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 2
    },
    {
      id: 3,
      uid: 'Havana-Cuba',
      countryId: 3,
      countryName: 'Cuba',
      cityName: 'Havana',
      cityImage: '',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 2
    }
  ]);

});

module.exports = router;