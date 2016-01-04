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
      uname: 'Seoul-South_Korea',
      countryId: 1,
      countryName: 'South_Korea',
      cityName: 'Seoul',
      cityImage: 'http://travel.aarp.org/content/dam/travel/destination-images/south-korea/seoul/1400-hero-seoul-south-korea-traffic-night.jpg',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 0
    },
    {
      id: 2,
      uname: 'Quetzaltenango-Guatemala',
      countryId: 2,
      countryName: 'Guatemala',
      cityName: 'Quetzaltenango',
      cityImage: 'http://www.revuemag.com/wp-content/uploads/2011/06/05-f04-xela-panorama.jpg',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 0
    },
    {
      id: 3,
      uname: 'Havana-Cuba',
      countryId: 3,
      countryName: 'Cuba',
      cityName: 'Havana',
      cityImage: 'http://www.maratonhabana.com/wp-content/uploads/2013/10/85.jpg',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 0
    },
    {
      id: 4,
      uname: 'Antigua-Guatemala',
      countryId: 3,
      countryName: 'Guatemala',
      cityName: 'Antigua',
      cityImage: 'http://www.escapefromamerica.com/wp-content/uploads/2013/03/antigua2.jpg',
      photos: [{
        url: '',
        userId:'',
        uploadAt: ''
      }],
      noteCount: 0
    }
  ]);

});

module.exports = router;