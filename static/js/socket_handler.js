let userId = localStorage.getItem('user_id');
let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function () {
    if (!userId) {
        userId = socket.id;
        localStorage.setItem('user_id', userId);
    }
    console.log(userId + " has connected");
    socket.emit('setUserId', {"userId" : userId} );
});

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
                socket.emit('showWinner', { cell_ids: cell_ids });
                socket.emit('updatePlayerPoints', { user_id: user_id });
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

socket.on('updatePlayerPoints', function(data){
    let selectors = ['.p1 p', '.p2 p'];  
    selectors.forEach(function(selector, index){
        let p_tag = document.querySelector(selector);
        p_tag.textContent = `Score : ${data['scores'][index]}`;
    });
});
