'use strict';

var _socket = require('socket.io-redis');

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = require('socket.io-emitter');

var _socket4 = _interopRequireDefault(_socket3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
var app = require('./config/express'); // The express app we just created

var _require = require('./config/index'),
    port = _require.port;

var DotENV = require('dotenv');
DotENV.config();
var env = process.env.NODE_ENV || 'production';
var config = require('./config/socket-config.json')[env];


var server = http.createServer(app).listen(port || 1000, function () {
    console.log('App listening on ' + port + '!');
});

var ios = require('socket.io')(server);
var emitter;
if (config.uri) {
    ios.adapter((0, _socket2.default)(config.uri));
    emitter = new _socket4.default(config.uri);
} else {
    ios.adapter((0, _socket2.default)({ "host": config.host, "port": config.port }));
    emitter = new _socket4.default({ "host": config.host, "port": config.port });
}
ios.of('/delivery').on('connection', function (socket) {
    console.log('Connected');
    socket.on('disconnect', async function () {
        console.log('Disconnected');
    });
});

global.emitter = emitter.of('/delivery');