var express = require('express'),
	app 	= express(),
	server 	= require('http').createServer(app),
	io 		= require('socket.io').listen(server);

server.listen(process.env.PORT || 3000, function() {
		console.log('Listening on port 3000...');
	});

app.use(express.static('./'))
   .get('*', function(req, res) {
	res.sendfile('index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('send message', function(data) {
		io.sockets.emit('new message', data);
	});
});