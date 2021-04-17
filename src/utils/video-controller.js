// The time, in seconds, for the client to send a 'reminder' message to the WebSocket server,
// in the name of keeping the connection alive. Disconnection seems to happen in ~600 seconds.
const INTERVAL_DURATION = 500;

const socket = new WebSocket('wss://qceh63bc59.execute-api.eu-west-1.amazonaws.com/production');

let checkInInterval;

socket.onopen = _e => {
    console.log('Connected to the WebSocket.')
    checkInInterval = setInterval(sendReminder, INTERVAL_DURATION * 1000);
};

socket.onclose = _e => {
    console.log('Disconnected from the WebSocket')
    clearInterval(checkInInterval);
};

socket.onmessage = e => {
    console.log('Received a message:', e);
    const command = JSON.parse(e.data).command;
    switch (command) {
        case 'enable':
            enableVideo();
            break;
        case 'disable':
            disableVideo();
            break;
        default:
            console.log('Received an unknown command:', command);
    }
};

function disableVideo() {
    const screen = document.querySelector('#naf-20BD6EAF-D619-44EE-8222-5A2019D21AC3');
    screen.setAttribute('video-pause-state', 'paused', true);
    screen.setAttribute('visible', false);
}

function enableVideo() {
    const screen = document.querySelector('#naf-20BD6EAF-D619-44EE-8222-5A2019D21AC3');
    screen.setAttribute('video-pause-state', 'paused', false);
    screen.setAttribute('visible', true);
}

function sendReminder() {
    const payload = { 'action': 'remind' };
    socket.send(JSON.stringify(payload));
    console.log('Sent a check-in message:', payload);
}