const socket = new WebSocket('ws://localhost:8080'); // Para Node.js
// const socket = io('http://localhost:5000'); // Para Flask-SocketIO

socket.onmessage = event => {
    const li = document.createElement('li');
    li.textContent = event.data;
    document.getElementById('messages').appendChild(li);
};

function sendGuess() {
    const guess = document.getElementById('guess').value;
    socket.send(guess);
}
