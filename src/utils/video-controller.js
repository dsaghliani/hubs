const socket = new WebSocket('wss://qceh63bc59.execute-api.eu-west-1.amazonaws.com/production');

socket.addEventListener('open', _e => console.log('Connected to the WebSocket.'));
socket.addEventListener('close', _e => console.log('Disconnected from the WebSocket'));
socket.addEventListener('message', e => {
    const command = JSON.parse(e.data).command;
    console.log('Received a command:', command);
});

