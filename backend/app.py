from flask import Flask
from flask_socketio import SocketIO, send
import random

app = Flask(__name__)
socketio = SocketIO(app)

# Generar número secreto
secret_number = random.randint(1, 100)
print("Número secreto:", secret_number)

@socketio.on('message')
def handle_message(msg):
    global secret_number
    guess = int(msg)
    if guess == secret_number:
        response = f"¡Correcto! El número era {secret_number}. Generando un nuevo número."
        secret_number = random.randint(1, 100)
        print("Nuevo número secreto:", secret_number)
    elif guess > secret_number:
        response = "Muy alto."
    else:
        response = "Muy bajo."

    send(response)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
