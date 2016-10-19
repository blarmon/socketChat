 $(document).ready(function(){
         var socket = io();
         var nickname;
         $('#chatForm').hide();
         
      $('#nicknameForm').submit(function(){
          nickname = $('#nickname').val();
          socket.emit('nicknameEmit', nickname);
          $('#nickname').val('');
          $('#nicknameForm').hide();
          $('#chatForm').show();
          return false;
      });
         
      $('#chatForm').submit(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
      });
       
     socket.on('chat message', function(data){
        $('#messages').append($('<li>').text(data.nick + ": " + data.msg));
     });
     
     socket.on('usernames', function(data) {
         $('#messages').append($('<li>').text(data + " has connected to chat!"));
     });
     
     socket.on('userDisconnect', function(data) {
         if (data) {
         $('#messages').append($('<li>').text(data + " has disconnected from chat!"));
         }
     });
  
     socket.on('populate_messages', function(data) {
       $('#messages').append($('<li>').text(data.message));
     });
     
    });