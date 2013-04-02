var fs = require('fs'),
  http = require('http'),
  socketio = require('socket.io');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-type': 'text/html'
  });
  // read the index.html file
  res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8080, function() {
  console.log('Listening at: http://localhost:8080');
});

// declare the global var. this is volatile
var count = 0;

// create the server connnection
socketio.listen(server).on('connection', function(socket) {
  // message is a reserved event
  socket.on('message', function(msg) {
    // show it in the node console
    console.log('Message Received: ', msg);
    // emit it to the other clients
    socket.broadcast.emit('message', msg);
  });
  // define the event
  socket.on('counter', function(val) {
    // add the passed value to the count
    count += val;
    console.log('count increased by ' + val + ' count is now ' + count);
    // send the data to all clients
    socket.broadcast.emit('counter', count);
    // update this client
    socket.emit('counter', count);
  });
});