socket.on('redirect', function (data) {
    console.log("REDIRECTING :", data.url);
    window.location.href = data.url;
});

