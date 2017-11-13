const http = require('http');
const app = require('./config/express'); // The express app we just created
const config = require('./config/index');

const port = parseInt(config.port, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
const io = require('socket.io')(server);
global.io = io;

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
});

server.listen(port,function(){
    console.log('Server start on port ' + port);
});
