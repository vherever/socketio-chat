var express 	= require('express'),
	app 		= express(),
	server 		= require('http').createServer(app),
	io 			= require('socket.io').listen(server),
	nicknames 	= [];

server.listen(process.env.PORT || 3000, function() {
		console.log('Listening on port 3000...');
	});

app.use(express.static('./'))
   .get('*', function(req, res) {
	res.sendfile('index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('new user', function(data, callback) {
		if(nicknames.indexOf(data) != -1) {
			callback(false); 
		} else {
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			//io.sockets.emit('usernames', nicknames); put that line to updateNicknames() function
			updateNicknames();
		}
	});

	function updateNicknames() {
		io.sockets.emit('usernames', nicknames);
	}

	socket.on('send message', function(data) {
		io.sockets.emit('new message', data);
	});

	socket.on('disconnect', function(data) {
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});
});