var socket_io = require('socket.io');
// call socket.io to the app
const io = socket_io()

// start listen with socket.io
io.on('connection', function(socket){
    console.log('A client connection occurred!');
  });