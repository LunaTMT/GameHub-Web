let userId = localStorage.getItem('user_id');
let roomName = generateRandomKey();  
let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function () {
    if (!userId) {
        userId = socket.id;
        localStorage.setItem('user_id', userId);
    }
    socket.emit('connect_user', { user_id: userId, room: roomName });
});

socket.on('connection_error', function(data) {
    console.log('Connection error:', data.message);
    alert('Connection error: ' + data.message);
    socket.disconnect();
});

socket.on('connected', function(data) {
    console.log('Connected with user ID:', data.user_id, 'in room:', data.room);
    localStorage.setItem('user_id', data.user_id);
});

socket.on('disconnect', function() {
    console.log('Disconnected');
    localStorage.removeItem('user_id');
});



function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let key = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }
  
    return key;
  }