// connect.js
let socket = io.connect('http://' + document.domain + ':' + location.port);
initialise()


// ROOM HANDLERS // 
socket.on('room_created', function (data) {
    console.log('Room created:', data.room_id);
});

socket.on('room_joined', function (data) {
    console.log('Joined room:', data.room_id);
    console.log('Users in the room:', data.users);
});

socket.on('room_maximum_capacity', function (data) {
    console.log('The room is at maximum capacity');
});

socket.on('play_game', function () {
    console.log("time to play")
    //document.getElementById('options').classList.add('hidden'); 
    //document.getElementById('game_content').classList.remove('hidden');

    
    // Assuming you want to redirect to a route named 'play_game'
    window.location.href = "{{ url_for('games.tictactoe') }}";

});



//Initialise client side share_link html
function initialise(){
    let user_id = getCookie('user_id');
    if (!user_id) {
        user_id = 'user_' + Date.now();  
        setCookie('user_id', user_id, 365); 
    }

    // Extract the room name from the URL
    let fullPath = window.location.pathname;
    let room_id = fullPath.split('/')[fullPath.split('/').length - 1];

    // Emit an event to create a room and add the user to it
    socket.emit('create_room', { user_id: user_id, room_id: room_id });
}

// Function to generate a user ID (if not available in local storage)
function generateUserId() {
    return 'user_' + Date.now();  // Replace with your logic to generate a user ID
}

// Function to get the value of a cookie by name
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// Function to set a cookie with a specific expiration time
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}