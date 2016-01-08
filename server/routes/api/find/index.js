'use strict';

const express = require('express');
const router  = express.Router();

router.get('/', function(req, res){

  res.json([
    {
      id  : 'fadsf',
      uname: 'Seoul,South_Korea',
      type : 'RedBook'
    }
  ]);

});
module.exports = router;