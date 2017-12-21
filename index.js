var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

app.use(express.static('public'));

var filePath = path.join(__dirname, ".", 'index.html');

var clients = {};

app.get('/', function(request, response){
    response.sendFile(filePath);
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('connect-to-room', function (data) {
        var room = data.room;
        console.log(room);

        if (room in clients) {
            clients[room].unshift(socket);
        } else {
            clients[room] = [socket];
        }
    });

    socket.on('chat-messages', function (data) {
        console.log(data);
        var msg = data.messages;
        var room = data.room;

        var socketList = clients[room];

        socketList.forEach(function (socket) {
            socket.emit('chat-messages', {'message': msg, 'roomId': room});
        });
    });

});

http.listen(8000, function () {
    console.log("Listening on port 8000");
});