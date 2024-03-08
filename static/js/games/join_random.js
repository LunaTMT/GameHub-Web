// join_random.js

// Declare the timer element
let timerElement;
let timerSeconds = 0;

// Function to join a random game every second
function joinRandomGame() {
    socket.emit('join_random', { game: window.roomVariables.game, user_id: window.roomVariables.user_id });
}


// Function to start the timer
function startTimer() {
    timerSeconds = 0;
    updateTimer();

    // Update the timer every second
    setInterval(function () {
        timerSeconds++;
        updateTimer();
    }, 1000);
}

// Function to update the timer display
function updateTimer() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.innerText = formattedTime;
}

// Socket event handler
socket.on('play_game', function (data) {
    console.log("GAME CONDITIONS SATISFIED: PLAY()");
    socket.emit('play_game', { game: data.game, room_id: data.room_id });
});

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Create the timer element
    timerElement = document.getElementById('timer');

    // Check if the element exists before calling startTimer
    if (timerElement) {
        startTimer();
    }
});

// Run joinRandomGame every second
setInterval(joinRandomGame, 1000);
