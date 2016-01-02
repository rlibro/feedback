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
    res.json([
      
      {
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
    break;

    case '2':
    res.json([
    {
      id: 2131324, 
      redBookId: 2,
      geo: {
        lat: '32.432423',
        lng: '123.342334'
      },
      content:'조용하니 살기 좋은덴데,... 상점은 저기 있다!',
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
    }])
    break;

    default:
    res.json([
      {
        id: 213324,
        redBookId: 3, 
        geo: {
          lat: '32.432423',
          lng: '123.342334'
        },
        content:'여기는 과테말라 쾌살테낭고! 춥다잉!',
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
      }
    ]);

  }

});

module.exports = router;