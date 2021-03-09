export class SerialKeyPress {
    static DOWN = 'DOWN';
    static UP = 'UP';

    constructor(signal) {
        this.signal = signal;

        this.action = signal[0] === 'd' ? SerialKeyPress.DOWN : SerialKeyPress.UP;
        this.button = parseInt(signal.substring(1));
    }

    isUp() {
        return this.action === SerialKeyPress.UP;
    }

    /**
     * The 1-based number used by the UI to identify the buttons
     */
    get buttonNumber() {
        return this.button + 1;
    }
}

export default class SerialFrontend {
    constructor() {
        this.channel = new MessageChannel();
        this.listeners = {};

        this._registerPortListener();
    }

    get port() {
        return this.channel.port2;
    }

    get remotePort() {
        return this.channel.port1;
    }

    openConnection(ipcRenderer, serialPort) {
        ipcRenderer.postMessage('serial:open', { port: serialPort }, [this.remotePort]);
    }

    on(event, callback) {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    emit(event, message) {
        this.port.postMessage({ event, message });
    }

    _fire(event, message) {
        const listeners = this.listeners[event] || [];

        listeners.forEach((callback) => callback(message));
    }

    _registerPortListener() {
        this.port.onmessage = (evt) => {
            console.log("Received", evt.data);
            const {event, message} = evt.data;

            this._fire(event, this._prepareMessage(message, event));
        }
    }

    _prepareMessage(message, event) {
        if (event === 'receive') {
            return new SerialKeyPress(message);
        }

        return message;
    }
}