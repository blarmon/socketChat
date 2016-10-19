var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];

var messages = []

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    
    for (var i in messages) {
      socket.emit('populate_messages', { message: messages[i] } );
   }
    
  socket.on('nicknameEmit', function(nicknameEmit){
      socket.nickname = nicknameEmit;
      nicknames.push(socket.nickname);
      io.sockets.emit('usernames', socket.nickname);
  });
  
  socket.on('chat message', function(data){
    io.emit('chat message', {msg: data, nick: socket.nickname});
    messages.push(socket.nickname + ": " + data);
  });
  
  socket.on('disconnect', function(){
    io.emit('userDisconnect', socket.nickname);
  });
  
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});