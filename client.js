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
			if($nickBox.val()) {
				socket.emit('new user', $nickBox.val(), function(data) {
					if(data) {
						$('#nickWrap').hide();
						$('#contentWrap').show();
					} else {
						$nickError.html('That username is already taken! Please chose another');
					}
				});
				$nickBox.val('');
			} else {
				$nickError.html('Please enter the name!');
			}
		});

		//displaying the list of online users
		socket.on('usernames', function(data) {
			var html = '';
			for(var i = 0; i < data.length; i ++) {
				html += '<a href="#">' + data[i] + '</a>' + '<br />';
			}
			$users.html(html);
			
		//var usr = []; 

			//another solution with join method
			//$users.html(data.join("<br />"));

			//after clicking on name push it value to input form
			var $tagsInput = $('#message');
		    $('#users a').click(function() {
		        $tagsInput[0].value = '/w ' + $(this).text() + ' ';
		        return false;
		   });
		    //then focus on input
		    $('#users a').click(function(){
			    $('#message').focus();
			});

	/*for(var i = 0; i < data.length; i ++) {
	usr.push(data[i]);
	}
console.log(usr);*/
	});



		$messageForm.submit(function(e) {
			e.preventDefault();
			socket.emit('send message', $messageBox.val(), function(data) {
				$chat.append('<span class="error">' + data + "</span><br />");
			});
			$messageBox.val(''); //clear input form
		});

		socket.on('load old msgs', function(docs) {
			for(var i = docs.length - 1; i >= 0; i --) {
				displayMsg(docs[i]);
			}
		});


		socket.on('new message', function(data) {
			//if(data.nick === usr[0])
			displayMsg(data);
			
		});

		function displayMsg(data) {
			$chat.append('<span class="msg"><b>' + data.nick + ': </b>' + data.msg + "</span><br />");
		}

		socket.on('whisper', function(data) {
			$chat.append('<span class="whisper"><b>' + data.nick + ': </b>' + data.msg + "</span><br />");
		});


		

});