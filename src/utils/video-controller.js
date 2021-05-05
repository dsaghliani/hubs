// INTERVAL_DURATION: The time, in seconds, for the client to send a 'reminder' message to the WebSocket
// server, in the name of keeping the connection alive. Disconnection seems to happen in ~600 seconds.
const INTERVAL_DURATION = 30;
const WEB_SOCKET_URL = 'wss://qceh63bc59.execute-api.eu-west-1.amazonaws.com/production';

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
            try {
                var data = JSON.parse(e.data);
            } catch (err) {
                console.log('The message received does not contain valid JSON data.', err);
                return;
            }
            
            const command = data.command;
            
            if (typeof command === 'undefined') {
                const message = data.message;
                
                if (typeof message !== 'undefined')
                    console.log("Received a check-in acknowledgement. (Pong.)")
                else
                    console.log("Received an unknown message:", data);
                    
                return;
            }
            
            console.log('Received a command:', data);
            
            const screenIndex = command.screenIndex;
            const newUrl = command.videoUrl;
            const newStatus = command.screenEnabled;

            this.setVideoUrl(screenIndex, newUrl);
            this.setVideoStatus(screenIndex, newStatus);
            
        };
    }

    disconnect() {
        console.log("Manually disconnecting from the WebSocket."); 
        this.socket.close(1000);
    }

    setVideoUrl(screenIndex, newUrl) {
        const screen = this.getScreen(screenIndex);
        screen.setAttribute("media-loader", "src", newUrl);
    }

    setVideoStatus(screenIndex, enabled) {
        const screen = this.getScreen(screenIndex);
        screen.setAttribute('video-pause-state', 'paused', !enabled);
        screen.setAttribute('visible', enabled);
    }
    
    sendReminder() {
        const payload = { 'action': 'remind' };
        this.socket.send(JSON.stringify(payload));
        console.log('Sent a check-in message. (Ping.)');
    }

    getScreen(screenIndex) {
        const screensInScene = document.querySelectorAll('[custom-screen]');
        
        for (const screen of screensInScene) {
            const customScreen = screen.components['custom-screen'];
            if (customScreen.data.screenIndex == screenIndex)
                return screen;
        }
    }
}