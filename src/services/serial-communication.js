import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';

export default class SerialCommunication {
    constructor(port = null, baudRate = 115200) {
        this.channelPort = null;
        if (port) {
            this.connect(port, baudRate)
        }
    }

    connect(port, baudRate = 115200) {
        this.port = new SerialPort(port, {
            baudRate,
        });

        this.parser = this.port.pipe(new Readline());

        this.parser.on('data', (data) => {
            this._answer({
                event: 'receive',
                message: data.toString().trim(),
            })
        });

        // Open errors will be emitted as an error event
        this.port.on('error', (err) => {
            this._answer({
                event: 'error',
                message: err,
            });
            this.disconnect();
        });
    }

    disconnect() {
        if (this.port.isOpen) {
            this.port.close();
        }
        this.port = null;
        this.parser = null;
    }

    /**
     * @param {MessagePort} channelPort
     */
    sendTo(channelPort) {
        console.log("Received message port");
        this.channelPort = channelPort;

        return this;
    }

    _answer(event) {
        if (this.channelPort) {
            this.channelPort.postMessage(event);
        }
    }
}