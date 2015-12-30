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
    },
    {
      id: 4,
      countryId: 3,
      countryName: 'Cuba',
      cityName: 'Vinales',
      cityImage: '',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 2
    },
    {
      id: 5,
      countryId: 3,
      countryName: 'Cuba',
      cityName: 'Cienfuegos',
      cityImage: '',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 10
    },
    {
      id: 6,
      countryId: 3,
      countryName: 'Cuba',
      cityName: 'Varadero',
      cityImage: '',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 10
    },
    {
      id: 7,
      countryId: 3,
      countryName: 'Mexico',
      cityName: 'Cancun',
      cityImage: '',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 21
    }
  ]);

});

module.exports = router;