'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('../routes/index');

_dotenv2.default.config();

// Set up the express app
var app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/', function (req, res) {
  return res.status(200).send({
    message: 'Welcome to the beginning of nothingness.'
  });
});
app.get('/port', function (req, res) {
  return res.send({
    message: process.env.EXPIRE_TIME
  });
});

app.use('/api', routes);

module.exports = app;