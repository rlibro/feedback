'use strict';

const express = require('express');
const uuid = require('uuid');
const moment = require('moment');
const router  = express.Router();

router.post('/', (req, res) => {
  var user = req.session.user;
  var commentText = req.body.noteText;
  var redBookId = req.body.redBookId;
  var uname = 0;

  switch(redBookId){
    case 1:
      uname = 'Seoul-South_Korea';
      break;

    case 2:
      uname = 'Quetzaltenango-Guatemala';
      break;

    case 3:
      uname = 'Havana-Cuba';
  }


  res.json({
    id: uuid.v4(),
    redBookId: redBookId,
    redBookUname: uname,
    geo: {
      lat: '32.432423',
      lng: '123.342334'
    },
    content: commentText,
    user: user,
    markers: [{
      id: 3432,
      type: 'eat',
      title: '바리스타 카페',
      geo: {
        lan: '23.3432',
        lng: '23.3222'
      }
    }],
    comments: [], 
    createdAt: moment().format()
  })

});


router.post('/comment', (req, res) => {
  var user = req.session.user;
  var commentText = req.body.commentText;
  var noteId = req.body.noteId;

  res.json({
    id: uuid.v4(),
    noteId: noteId,
    user: user,
    content: commentText, 
    createdAt: moment().format()
  })

});

router.get('/', (req, res) => {

  const redBookId = req.query.redBookId

  res.links({
    next: 'http://localhost/api/notes?page=2',
    last: 'http://localhost/api/notes?page=2'
  });

  switch (redBookId){
    case '1':
    res.json([]);
    break;

    case '2':
    res.json([])
    break;

    default:
    res.json([]);

  }

});

module.exports = router;