'use strict';

var http = require('http');
var app = require('./config/express'); // The express app we just created
var config = require('./config/index');

var port = parseInt(config.port, 10) || 8000;
app.set('port', port);

var server = http.createServer(app);
server.listen(port, function () {
    console.log('Server start on port ' + port);
});