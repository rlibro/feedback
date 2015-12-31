'use strict';

const express = require('express');
const uuid = require('uuid');
const moment = require('moment');
const router  = express.Router();

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
        id: 123, 
        cityId: 1, 
        geo: {
          lat: '32.432423',
          lng: '123.342334'
        },
        content:'여기는 좀 춥습니다. 옷가지 챙겨오세요!! [여기]:(3432) 좋아요!',
        createdAt: '2015-11-23T12:32:11',
        userId: 213,
        user: {
          id: 213,
          name: 'Sohn ByungDae'
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
      },
      {
        id: 2123, 
        cityId: 1, 
        geo: {
          lat: '32.432423',
          lng: '123.342334'
        },
        content:'여기는 서울! 좀 춥습니다. 옷가지 챙겨오세요!! [여기]:(3432) 좋아요!',
        createdAt: '2015-12-23T14:12:11',
        userId: 213,
        user: {
          id: 213,
          name: 'Sohn ByungDae'
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
      },
      {
        id: 3123, 
        cityId: 1, 
        geo: {
          lat: '32.432423',
          lng: '123.342334'
        },
        content:'여기는 한국! 옷가지 챙겨오세요!! [여기]:(3432) 좋아요!',
        createdAt: '2015-11-23T12:32:11',
        userId: 213,
        user: {
          id: 213,
          name: 'Sohn ByungDae'
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
      id: 213324, 
      cityId: 2, 
      geo: {
        lat: '32.432423',
        lng: '123.342334'
      },
      content:'여기는 과테말라 쾌살테낭고! 춥다잉!',
      createdAt: '2015-11-23T12:32:11',
      userId: 213,
      user: {
        id: 213,
        name: 'Sohn ByungDae'
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
    },
    {
      id: 2131324, 
      cityId: 2, 
      geo: {
        lat: '32.432423',
        lng: '123.342334'
      },
      content:'조용하니 살기 좋은덴데,... 상점은 저기 있다!',
      createdAt: '2015-11-23T12:32:11',
      userId: 213,
      user: {
        id: 213,
        name: 'Sohn ByungDae'
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
        cityId: 2, 
        geo: {
          lat: '32.432423',
          lng: '123.342334'
        },
        content:'여기는 과테말라 쾌살테낭고! 춥다잉!',
        createdAt: '2015-11-23T12:32:11',
        userId: 213,
        user: {
          id: 213,
          name: 'Sohn ByungDae'
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