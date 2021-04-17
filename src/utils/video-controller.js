// INTERVAL_DURATION: The time, in seconds, for the client to send a 'reminder' message to the WebSocket
// server, in the name of keeping the connection alive. Disconnection seems to happen in ~600 seconds.
const INTERVAL_DURATION = 500;
const WEB_SOCKET_URL = 'wss://qceh63bc59.execute-api.eu-west-1.amazonaws.com/production';
// MAIN_SCREEN_ID: Eventually, when multiple screens are present, screen ID can be incorporated into the
// WebSocket-delivered commands. Until then, it's simpler to keep the sole ID in a constant.
const MAIN_SCREEN_ID = 'naf-20BD6EAF-D619-44EE-8222-5A2019D21AC3';

export class VideoController {
    constructor() {
        this.socket = new WebSocket(WEB_SOCKET_URL);

        this.socket.onopen = _e => {
            console.log('Connected to the WebSocket.')
            this.checkInInterval = setInterval(this.sendReminder, INTERVAL_DURATION * 1000);
        };
        
        this.socket.onclose = _e => {
            console.log('Disconnected from the WebSocket')
            clearInterval(this.checkInInterval);
        };
        
        this.socket.onmessage = e => {
            console.log('Received a message:', e);

            try {
                var data = JSON.parse(e.data);
            } catch (err) {
                console.log('The message received does not contain valid JSON data.', err);
                return;
            }

            const command = data.command;
            const screen = this.findScreen(MAIN_SCREEN_ID);
            
            switch (command) {
                case 'enable':
                    this.setVideoStatus(screen, true);
                    break;
                case 'disable':
                    this.setVideoStatus(screen, false);
                    break;
                default:
                    console.log('Received an unknown command:', command);
            }
        };
    }

    disconnect() {
        this.socket.close(1000);
    }

    setVideoStatus(screen, enabled) {
        screen.setAttribute('video-pause-state', 'paused', enabled ? false : true);
        screen.setAttribute('visible', enabled ? true : false);
    }
    
    sendReminder() {
        const payload = { 'action': 'remind' };
        socket.send(JSON.stringify(payload));
        console.log('Sent a check-in message:', payload);
    }

    findScreen(screenId) { 
        return document.querySelector(`#${screenId}`);
    }
}