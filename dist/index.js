'use strict';

var http = require('http');
var app = require('./config/express'); // The express app we just created
var config = require('./config/index');

var port = parseInt(config.port, 10) || 8000;
app.set('port', port);

var server = http.createServer(app);
var io = require('socket.io')(server);
global.io = io;

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
    });
});

server.listen(port, function () {
    console.log('Server build start on port ' + port);
});