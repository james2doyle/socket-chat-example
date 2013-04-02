var fs = require('fs'),
  http = require('http'),
  socketio = require('socket.io');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-type': 'text/html'
  });
  res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8080, function() {
  console.log('Listening at: http://localhost:8080');
});

var count = 0;

socketio.listen(server).on('connection', function(socket) {
  socket.on('message', function(msg) {
    console.log('Message Received: ', msg);
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