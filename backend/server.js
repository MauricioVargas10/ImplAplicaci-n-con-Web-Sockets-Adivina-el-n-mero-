const WebSocket = require('ws');

// Configuración del servidor WebSocket
const server = new WebSocket.Server({ port: 8080 });
let players = []; // Lista de jugadores conectados
let secretNumber = Math.floor(Math.random() * 100) + 1; // Número aleatorio

console.log("Número secreto:", secretNumber);

server.on('connection', socket => {
    // Asigna un número al jugador y lo agrega a la lista
    const playerId = players.length + 1;
    players.push(socket);
    console.log(`Jugador ${playerId} conectado`);

    // Notifica al jugador sobre su identificación
    socket.send(`Te has conectado como Jugador ${playerId}. ¡Adivina el número!`);

    // Notifica a todos los jugadores que hay una nueva conexión
    broadcast(`¡Jugador ${playerId} se ha conectado!`);

    // Maneja los mensajes del jugador
    socket.on('message', message => {
        const guess = parseInt(message, 10);
        let response;

        if (guess === secretNumber) {
            response = `¡Jugador ${playerId} adivinó correctamente! El número era ${secretNumber}. Generando un nuevo número.`;
            secretNumber = Math.floor(Math.random() * 100) + 1;
            console.log("Nuevo número secreto:", secretNumber);

            // Notifica a todos los jugadores sobre el ganador y el nuevo número
            broadcast(response);
            broadcast("Se ha generado un nuevo número. ¡Adivina nuevamente!");
        } else if (guess > secretNumber) {
            response = `Jugador ${playerId}: Muy alto.`;
        } else {
            response = `Jugador ${playerId}: Muy bajo.`;
        }

        // Enviar respuesta al jugador actual
        socket.send(response);
    });

    // Maneja la desconexión del jugador
    socket.on('close', () => {
        console.log(`Jugador ${playerId} desconectado`);
        players = players.filter(player => player !== socket); // Eliminar de la lista
        broadcast(`Jugador ${playerId} se ha desconectado.`);
    });
});

// Función para enviar mensajes a todos los jugadores
function broadcast(message) {
    players.forEach(player => {
        if (player.readyState === WebSocket.OPEN) {
            player.send(message);
        }
    });
}
