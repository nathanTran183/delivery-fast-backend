const http = require('http');
const app = require('./config/express'); // The express app we just created
const {port} = require('./config/index');
const DotENV = require('dotenv');
DotENV.config()
const env = process.env.NODE_ENV || 'production';
const config = require('./config/socket-config.json')[env];
import Redis from 'socket.io-redis';
import Emitter from 'socket.io-emitter';

const server = http.createServer(app).listen(port || 1000, () => {
    console.log(`App listening on ${port}!`);
});

const ios = require('socket.io')(server);
var emitter;
if (config.uri) {
    ios.adapter(Redis(config.uri));
    emitter = new Emitter(config.uri);
} else {
    ios.adapter(Redis({"host": config.host, "port": config.port}));
    emitter = new Emitter({"host": config.host, "port": config.port});
}
ios
    .of('/delivery')
    .on('connection', (socket) => {
        console.log('Connected');
        socket.on('disconnect', async () => {
            console.log('Disconnected');
        });
    });

global.emitter = emitter.of('/delivery');
