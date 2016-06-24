var app = require('http').createServer();
var io = require('socket.io')(app);

var sockets = [];
var messages = [];
var users = [];

io.on('connection', (socket) => {
  
  sockets.push(socket);
  console.log('[new user connected], total: ' + sockets.length, 'id: ' + socket.id);
  
  socket.emit('startData', {
    messages: messages,
    users: users
  });
  
  socket.on('user', function(user) {
    console.log(user);
    users.push(user);
    socket.user = user;
    io.emit('user', user);
  });
  
  socket.on('message', (data) => {
    data.date = new Date();
    messages.push(data);
    console.log(data);
    io.emit('message', data);
  });
  
  // disconnect
	socket.on('disconnect', () => {
	  
	  // emit event off
	  io.emit('userOff', socket.user);
	  // remove user of array
	  users = users.filter(function(user) {
	    return user != socket.user;
	  });
	  
	  // remove socket of array
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
	  console.log('[user disconnected], total: ', sockets.length);
	});
  
});
  
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", () => {
  var addr = app.address() || '127.0.0.1';
  addr.address = '127.0.0.1';
  console.log("Chat server listening at", addr.address + ":" + addr.port + ' with ' + addr.family);
});
