
let socket = io.connect('http://' + document.domain + ':' + location.port);
let fullPath = window.location.pathname.split('/');
let room_id = fullPath[fullPath.length - 1]; 
let user_id = getCookie('user_id');

socket.on('updateBoard', function(data) {
    let { cell_id, symbol_class } = data;
    const cell = document.getElementById(cell_id);
    const symbolDiv = document.createElement('div');
    symbolDiv.className = symbol_class;
    cell.appendChild(symbolDiv);
});

socket.on('resetBoard', function() {
    let cols = document.querySelectorAll(".col");
    cols.forEach(col => {
        col.innerHTML = ''; 
        col.style.backgroundColor = "white";
    });
});

socket.on('undo', function(last_poisiton_id){ 
    last_position = document.getElementById(last_poisiton_id);
    last_position.removeChild(last_position.lastChild); 

});

socket.on('checkWin', function() {
    const rows = [
        [document.getElementById('col_1'), document.getElementById('col_2'), document.getElementById('col_3')],
        [document.getElementById('col_4'), document.getElementById('col_5'), document.getElementById('col_6')],
        [document.getElementById('col_7'), document.getElementById('col_8'), document.getElementById('col_9')]];
    const cols = [
        [document.getElementById('col_1'), document.getElementById('col_4'), document.getElementById('col_7')],
        [document.getElementById('col_2'), document.getElementById('col_5'), document.getElementById('col_8')],
        [document.getElementById('col_3'), document.getElementById('col_6'), document.getElementById('col_9')]];
    const diagonals = [
        [document.getElementById('col_1'), document.getElementById('col_5'), document.getElementById('col_9')],
        [document.getElementById('col_3'), document.getElementById('col_5'), document.getElementById('col_7')]];

    function satisfiesWinCondition(symbols) {
        return symbols.every(symbol => symbol !== null && symbol === symbols[0]);
    }

    function checkArrayForWin(arrays) {
        for (const arr of arrays) {
            
            const symbols = arr.map(cell => {
                const firstChild = cell ? cell.firstChild : null;
                return firstChild ? firstChild.className : null;
            });
    
            if (satisfiesWinCondition(symbols)) {
                let cell_ids = arr.map(cell => cell.id);
                socket.emit('showWinner',         { room_id : room_id, cell_ids: cell_ids });
                socket.emit('updatePlayerPoints', { room_id : room_id});
                return true
            }
        }
        return false;
    }
        
    if (checkArrayForWin(rows, "rows"))          { return ;}
    if (checkArrayForWin(cols, "cols"))          { return ;}
    if (checkArrayForWin(diagonals, "diagonal")) { return ;}
});

socket.on('highlightWinner', function(data) {
    data['cell_ids'].forEach(cell_id => {
        let cell = document.getElementById(cell_id);
        cell.style.backgroundColor = '#00FF00';
    });
});

socket.on('displayPoints', function(data){
    let selectors = ['.p1 p', '.p2 p'];  
    selectors.forEach(function(selector, index){
        let p_tag = document.querySelector(selector);
        p_tag.textContent = `Score : ${data['points'][index]}`; 
    });
});


function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function placeSymbol(cell) {
    if (!cell.firstChild) {
        socket.emit('placeSymbol', {cell_id : cell.id, 
                                    user_id : user_id,
                                    room_id : room_id});   
    }
}

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('play_again').addEventListener('click', function() {
      socket.emit('resetBoard', { room_id : room_id });
    });

  });