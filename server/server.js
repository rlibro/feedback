'use strict';
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../webpack.config')
var express = require('express');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var compiler = webpack(config)
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  extname: '.hbs',
  partialsDir: ['./server/views/partials']
}));
app.set('view engine', 'hbs');

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(session({ 
  secret: 'redbook', 
  saveUninitialized: false,
  resave: false
}));
app.use(bodyParser.json());
app.use(express.static( path.resolve(__dirname, '../public') ));
app.use(require('./libs/middleware/1_req_session'));

// 라우터 처리
require('./routes')(app);

module.exports = app;
