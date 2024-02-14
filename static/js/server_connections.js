let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function () {
    console.log('Connected to the server');
});

socket.on('connected', function (data) {
    console.log('Connected with user ID:', data.user_id, 'in room:', data.room);
});

socket.on('connection_error', function (data) {
    console.log('Connection error:', data.message);
    alert('Connection error: ' + data.message);
    socket.disconnect();
});

socket.on('disconnect', function () {
    console.log('Disconnected');
});
