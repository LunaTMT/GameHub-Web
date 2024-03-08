let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function () {
    console.log('SERVER CONNECTION ESTABLISHED');
});

socket.on('connection_error', function (data) {
    console.log('SERVER CONNECTION :', data.message);
    alert('CONNECTION ERROR: ' + data.message);
    socket.disconnect();
});

socket.on('disconnect', function () {
    console.log('SERVER DISCONNECTION');
});
