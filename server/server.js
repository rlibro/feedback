'use strict';
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('../webpack.config');
var express = require('express');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var path = require('path');
var compiler = webpack(config);
var app = express();
var Parse = require('parse');
Parse.initialize('oI9ho8CTpm5bFDliirnMFEdH3UGCzaBI8YHBtlnD', '97zh1DEXSPm7DiJjRZYy8KXJBMUVmSxUrScJlgAh');

// Webpack Setup!
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  extname: '.hbs',
  partialsDir: ['./server/views/partials']
}));
app.set('view engine', 'hbs');

app.use(favicon( path.resolve(__dirname, '../public/favicon.ico')));

app.use(cookieParser());
app.use(session({ 
  secret: 'redbook-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(express.static( path.resolve(__dirname, '../public') ));
app.use(require('./libs/middleware/1_req_session'));

// 라우터 처리
require('./routes')(app);

module.exports = app;
