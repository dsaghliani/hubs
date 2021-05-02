// INTERVAL_DURATION: The time, in seconds, for the client to send a 'reminder' message to the WebSocket
// server, in the name of keeping the connection alive. Disconnection seems to happen in ~600 seconds.
const INTERVAL_DURATION = 500;
const WEB_SOCKET_URL = 'wss://qceh63bc59.execute-api.eu-west-1.amazonaws.com/production';
const SCREEN_ID = 'naf-20BD6EAF-D619-44EE-8222-5A2019D21AC3';

export class VideoController {
    constructor() {
        this.socket = new WebSocket(WEB_SOCKET_URL);

        this.socket.onopen = _e => {
            console.log('Connected to the WebSocket.');

            // It's important to call `this.sendReminder()` this way, instead of simply passing it in, or else `this` won't be bound correctly.
            this.checkInInterval = setInterval(() => this.sendReminder(), INTERVAL_DURATION * 1000);
        };
        
        this.socket.onclose = _e => {
            console.log('Disconnected from the WebSocket');
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
            
            for (const key in command) {
                switch(key) {
                    case 'newUrl':
                        this.setVideoUrl(command[key]);
                        break;
                    case 'newStatus':
                        this.setVideoStatus(command[key]);
                        break;
                }
            }
        };
    }

    disconnect() {
        console.log("Manually disconnecting from the WebSocket.");
        this.socket.close(1000);
    }

    async setVideoStatus(enabled) {
        const screen = this.getScreen();
        const networkedScreen = await NAF.utils.getNetworkedEntity(screen);

        if (NAF.utils.isMine(networkedScreen))
            networkedScreen.setAttribute('video-pause-state', 'paused', enabled ? false : true);
        
        // The component `visible` is not networked, so everyone has to change it on their own local client.
        screen.setAttribute('visible', enabled ? true : false);
    }

    async setVideoUrl(newUrl) {
        const screen = this.getScreen();
        const networkedScreen = await NAF.utils.getNetworkedEntity(screen);
        
        if (NAF.utils.isMine(networkedScreen))
            networkedScreen.setAttribute('media-loader', 'src', newUrl);
    }
    
    sendReminder() {
        const payload = { 'action': 'remind' };
        this.socket.send(JSON.stringify(payload));
        
        console.log('Sent a check-in message.');
    }

    getScreen() {
        return document.querySelector(`#${SCREEN_ID}`);
    }
}