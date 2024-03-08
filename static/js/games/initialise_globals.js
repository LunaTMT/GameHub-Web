window.roomVariables = {
    user_id: null,
    game: null,
    room_id: null
};

function initialise_globals() {
    window.roomVariables.user_id = getCookie('user_id');
    if (!window.roomVariables.user_id) {
        window.roomVariables.user_id = 'user_' + Date.now();  
        setCookie('user_id', window.roomVariables.user_id, 365); 
    }

    // Extract the room name from the URL
    let fullPath                 = window.location.pathname.split('/');
    window.roomVariables.game    = fullPath[1];  // Remove 'window.' here
    window.roomVariables.room_id = fullPath[fullPath.length - 1];  // Remove 'window.' here
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

initialise_globals();
