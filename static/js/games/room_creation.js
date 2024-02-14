
initialise()

//Initialise client side share_link html
function initialise(){
    let user_id = getCookie('user_id');
    if (!user_id) {
        user_id = 'user_' + Date.now();  
        setCookie('user_id', user_id, 365); 
    }

    // Extract the room name from the URL
    let fullPath = window.location.pathname.split('/');
    let game = fullPath[1]; 
    let room_id = fullPath[fullPath.length - 1]; 
    console.log(fullPath)

    // Emit an event to create a room and add the user to it
    socket.emit('create_room', {game    : game, 
                                user_id : user_id, 
                                room_id : room_id });
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

// ROOM HANDLERS // 
socket.on('room_created', function (data) {
    console.log('Room created:', data.room_id);
    localStorage.setItem('user_id', data.user_id);
});

socket.on('room_joined', function (data) {
    console.log(data.user_id + ' joined ' + data.room_id);
    console.log('Users in the room:', data.users);
});

socket.on('room_maximum_capacity', function (data) {
    console.log('The room is at maximum capacity');
});



