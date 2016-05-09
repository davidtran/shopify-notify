

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var FileStore = require('session-file-store')(session);

var routes = require('./routes/index');
var routeInstall = require('./routes/install');
var routeAdmin = require('./routes/admin');
var routeResource = require('./routes/resource');
var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  store: new FileStore(),
  secret: 'shopify-notify',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.locals.activeRoute = req.path.trim();
  res.locals.GOOGLE_ANALYTIC_ID = process.env.GOOGLE_ANALYTIC_ID;
  return next();
});
app.use('/', routes);
app.use('/install', routeInstall);
app.use('/admin', routeAdmin);
app.use('/resource', routeResource);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
