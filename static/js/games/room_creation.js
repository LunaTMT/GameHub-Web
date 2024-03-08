// Initialise client side share_link html
function initialise(){
    // Emit an event to create a room and add the user to it
    socket.emit('create_room', {
        game: window.roomVariables.game,
        user_id: window.roomVariables.user_id,
        room_id: window.roomVariables.room_id
    });
}

// ROOM HANDLERS // 
socket.on('room_created', function (data) {
    localStorage.setItem('user_id', data.user_id);
});

socket.on('room_joined', function (data) {
    console.log(`ROOM ${window.roomVariables.room_id} \n {\n\t${data.users.join('\n\t')}\n }`);
});

function leaveRoom() {
    socket.emit('leave_room', {
        user_id: window.roomVariables.user_id,
        room_id: window.roomVariables.room_id
    });
}


socket.on('room_maximum_capacity', function (data) {
    console.log('The room is at maximum capacity');
});


socket.on('play_game', function (data) {
    socket.emit('play_game', { game: data.game, room_id: data.room_id });
});


initialise();
