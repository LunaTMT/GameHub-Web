

socket.on('play_game', function (data) {
    console.log("time to play");
    socket.emit('play_game', { game: data.game, room_id: data.room_id });
    console.log("emitted")
});

socket.on('redirect', function (data) {
    console.log("Redirecting to:", data.url);
    window.location.href = data.url;
});





