var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = ['first msg']

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
  });
  
  socket.on('disconnect', function(){
    io.emit('userDisconnect', socket.nickname);
  });
  
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});