'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('../routes/index');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var passport = require('passport');
var multer = require('multer');

var Path = require('path');

_dotenv2.default.config();

// Set up the express app
var app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(Path.join(__dirname, "../publics")));
app.set('view engine', 'ejs');
app.set('views', Path.join(__dirname, '../views'));
app.use('/bower_components', express.static(Path.join(__dirname, "../../bower_components")));
app.use(cookieParser());

// config session
app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    resave: false,
    saveUninitialized: true,
    ephemeral: true
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// config connect-flash
// app.use(cookieParser('messages plash'));
// app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// config express-validator
app.use(expressValidator()); //required for Express-Validator

app.use('/api', routes.Api);
app.use('/', routes.Web);
app.get('/test', function (req, res) {
    res.render('test');
});
module.exports = app;