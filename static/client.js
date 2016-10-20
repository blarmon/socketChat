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
        var currentNames = ''
         for (var i in data.names) {
          currentNames += '<li>' + data.names[i];
         }
         
         $("#users").html(currentNames);
     });
  
     socket.on('populate_messages', function(data) {
       $('#messages').append($('<li>').text(data.message));
     });
     
     
      function mainLoop() {
      // check if the user is typing
      if ($('#m').val() != '') {
         // send line to to the server
         socket.emit('isTyping', nickname);
      }
      setTimeout(mainLoop, 25);
   }
   mainLoop();
     
     socket.on('isTyping', function(data) {
      console.log(data);
      var html = '';
      if (data.length === 1) {
       html = data + ' is typing!';
      }
      else if (data.length > 1) {
       html = 'multiple users are typing!';
      }
      else {
       html = '';
      }
       $('.currentlyTyping').html(html);
     });
});