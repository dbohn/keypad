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
        if (this.port) {
            this.disconnect();
        }
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

        this.port.on('open', (event) => {
            this._answer({
                event: 'open',
                message: event,
            });
        })

        // Open errors will be emitted as an error event
        this.port.on('error', (err) => {
            this._answer({
                event: 'error',
                message: err,
            });
            this.disconnect();
        });

        this.port.on('close', (err) => {
            this._answer({
                event: 'close',
                disconnected: err !== null ? err.disconnected : true,
            });

            this.disconnect();
        })
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
        this.channelPort = channelPort;

        this.channelPort.on('message', ({data: {event, message}}) => {
            if (event === 'color') {
                this.port.write(message);
            }
        });

        this.channelPort.start();

        return this;
    }

    _answer(event) {
        if (this.channelPort) {
            this.channelPort.postMessage(event);
        }
    }

    static async listPorts() {
        return SerialPort.list();
    }
}