var express = require('express');
var socketIO  = require('socket.io');
var path = require('path');

var PORT = process.env.PORT || 5000;
var INDEX = path.join(__dirname, 'index.html');

var server = express()
  .use(function(req, res) { res.sendFile(INDEX); })
  .listen(PORT, function() { console.log('Listening on ' + PORT); });

var io = socketIO(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
