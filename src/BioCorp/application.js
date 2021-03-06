
require("./models/request");
require("./models/db");

var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var $ = require('jquery');
var routes = require('./routes/index');
var users = require('./routes/users');

var mongoose = require('mongoose');
var api = require('./routes/api');
var i18n = require("i18n-express");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), 
  siteLangs: ["en","fr"]
}));

app.use('/', routes);
app.use('/users', users);

app.use('/license', routes);

app.post('/requests/', api.createRequest);
app.get('/requests/:id', api.getRequest);
app.delete('/requests/:id', api.deleteRequest);
app.put('/requests/:id', api.updateRequest);
app.get('/requests/:id/status', api.getRequestStatus);
app.get('/requests/:id/results', api.getResults);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
