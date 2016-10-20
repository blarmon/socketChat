var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];

var messages = [];

 var currentlyTyping = [];

app.use(express.static(__dirname + '/static'));

io.on('connection', function(socket){
    
    for (var i in messages) {
      socket.emit('populate_messages', { message: messages[i] } );
    }
    
  socket.on('nicknameEmit', function(nickname){
    io.emit('userConnect', socket.nickname);
      socket.nickname = nickname;
      nicknames.push(socket.nickname);
      io.sockets.emit('usernames', {names: nicknames, nick: socket.nickname});
  });
  
  socket.on('chat message', function(data){
    io.emit('chat message', {msg: data, nick: socket.nickname});
    messages.push(socket.nickname + ": " + data);
  });
  
  socket.on('disconnect', function(){
    io.emit('userDisconnect', socket.nickname);
    if (!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket.nickname, 1));
    io.sockets.emit('usernames', {names: nicknames, nick: socket.nickname});
  });
  
  socket.on('isTyping', function(data) {
    if (currentlyTyping.indexOf(data) === -1) {
       currentlyTyping.push(data);
       for (var i in currentlyTyping){
       console.log(currentlyTyping[i]);
       }
    }
    io.emit('isTyping', currentlyTyping);
  });
  
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});