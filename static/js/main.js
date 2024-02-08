let user_id = localStorage.getItem('user_id');

function placeSymbol(cell) {
    if (!cell.firstChild) {
        socket.emit('placeSymbol', { cell_id: cell.id, 
                                     user_id: user_id });   
    }
}

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('restart').addEventListener('click', function() {
      socket.emit('resetBoard');
    });

    document.getElementById('undo').addEventListener('click', function() {
      socket.emit('undo');
    });
  });