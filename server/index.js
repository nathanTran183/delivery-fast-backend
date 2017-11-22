const http = require('http');
const app = require('./config/express'); // The express app we just created
const {port} = require('./config/index');

import Redis from 'socket.io-redis';
import Emitter from 'socket.io-emitter';

const server = http.createServer(app).listen(port || 1000, () => {
    console.log(`App listening on ${port}!`);
});

const ios = require('socket.io')(server);
ios.adapter(Redis({"host": "127.0.0.1", "port": 6379}));
ios
    .of('/delivery')
    .on('connection', (socket) => {
    console.log('Connected');
    socket.on('disconnect', async () => {
        console.log('Disconnected');
    });
});

const emitter = new Emitter({
    "host": "127.0.0.1",
    "port": 6379
});
global.emitter = emitter.of('/delivery');
