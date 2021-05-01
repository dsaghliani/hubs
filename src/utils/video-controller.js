// INTERVAL_DURATION: The time, in seconds, for the client to send a 'reminder' message to the WebSocket
// server, in the name of keeping the connection alive. Disconnection seems to happen in ~600 seconds.
const INTERVAL_DURATION = 500;
const WEB_SOCKET_URL = 'wss://qceh63bc59.execute-api.eu-west-1.amazonaws.com/production';

export class VideoController {
    constructor() {
        this.socket = new WebSocket(WEB_SOCKET_URL);

        this.socket.onopen = _e => {
            console.log('Connected to the WebSocket.');
            this.checkInInterval = setInterval(() => this.sendReminder(), INTERVAL_DURATION * 1000);
        };
        
        this.socket.onclose = _e => {
            console.log('Disconnected from the WebSocket');
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
            const screen = this.findScreen();
            
            for (const key in command) {
                switch(key) {
                    case 'newUrl':
                        this.setVideoUrl(screen, command[key]);
                        break;
                    case 'newStatus':
                        this.setVideoStatus(screen, command[key]);
                        break;
                }
            }
        };
    }

    disconnect() {
        console.log("Manually disconnecting from the WebSocket.");
        this.socket.close(1000);
        clearInterval(this.checkInInterval);
    }

    setVideoStatus(screen, enabled) {
        screen.setAttribute('video-pause-state', 'paused', enabled ? false : true);
        screen.setAttribute('visible', enabled ? true : false);
    }

    setVideoUrl(screen, newUrl) {
        screen.setAttribute('media-loader', 'src', newUrl);
    }
    
    sendReminder() {
        const payload = { 'action': 'remind' };
        this.socket.send(JSON.stringify(payload));
        console.log('Sent a check-in message:', payload);
    }

    // TODO change later!
    findScreen() { 
        return document.querySelector('[media-video]'); 
    }
}