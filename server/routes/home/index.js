'use strict';
const express = require('express');
const router  = express.Router();

function mainRoute(req, res){

  console.log('==> params', req.params);

  res.render('index')
}

router.get('/', mainRoute);
router.get('/:redBookId', mainRoute);
router.get('/:redBookId/:noteId', mainRoute);

module.exports = router;
