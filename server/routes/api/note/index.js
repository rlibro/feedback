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
      uname = 'Seoul_South,Korea';
      break;

    case 2:
      uname = 'Quetzaltenango,Guatemala';
      break;

    case 3:
      uname = 'Havana,Cuba';
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

  const uname = req.query.uname

  res.links({
    next: 'http://localhost/api/notes?page=2',
    last: 'http://localhost/api/notes?page=2'
  });

  if( uname === 'Seoul,South_Korea') {
    res.json([{
      id: 3123,
      redBookId: 1,
      geo: {
        lat: '32.432423',
        lng: '123.342334'
      },
      content:'여기는 한국! 옷가지 챙겨오세요!! [여기]:(3432) 좋아요!',
      createdAt: '2015-11-23T12:32:11',
      user: {
        email: "miconblog@gmail.com",
        id: "10153031949693302",
        name: "ByungDae Sohn",
        picture: {
          data: {
            url: "https://scontent.xx.fbcdn.net/hprofile-xap1/v/t1.0-1/p50x50/1510494_10151938283373302_404117394_n.jpg?oh=14fb9c1fcd97aa23810499900f48b57b&oe=5719336B"
          }
        }
      },
      markers: [{
        id: 3432,
        type: 'eat',
        title: '바리스타 카페',
        geo: {
          lan: '23.3432',
          lng: '23.3222'
        }
      }],
      comments: []
    }]);
  }
  else {
    res.json([]);
  }

});

module.exports = router;