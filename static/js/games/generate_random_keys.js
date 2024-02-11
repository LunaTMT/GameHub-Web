function generateRandomKey() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~';
    let randomKey = '';

    for (let i = 0; i < 8; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        randomKey += characters.charAt(randomIndex);
    }

    return randomKey;
}

document.getElementById('shareLinkForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let randomKey = generateRandomKey();
    window.location.href = "{{ url_for('games.share_link', random_key='__random_key__') }}".replace('__random_key__', randomKey);
});