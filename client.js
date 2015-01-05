jQuery(function() {
	var socket 			= io.connect(),
		$nickForm		= $('#setNick'),
		$nickError		= $('#nickError'),
		$nickBox		= $('#nickname'),
		$users			= $('#users'),
		$messageForm 	= $('#send-message'),
		$messageBox 	= $('#message'),
		$chat 			= $('#chat');

		$nickForm.submit(function(e) {
			e.preventDefault();
			socket.emit('new user', $nickBox.val(), function(data) {
				if(data) {
					$('#nickWrap').hide();
					$('#contentWrap').show();
				} else {
					$nickError.html('That username is already taken! Please chose another');
				}
			});
			$nickBox.val('');
		});

		//displaying the list of online users
		socket.on('usernames', function(data) {
			/*var html = '';
			for(i = 0; i < data.length; i ++) {
				html += data[i] + '<br />';
			}
			$users.html(html);*/

			//another solution with join method
			$users.html(data.join("<br />"));
		});

	$messageForm.submit(function(e) {
		e.preventDefault();
		socket.emit('send message', $messageBox.val());
		$messageBox.val(''); //clear input form
	});
	socket.on('new message', function(data) {
		$chat.append(data + "<br />");
	});
});