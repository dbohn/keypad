import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';

export default class SerialCommunication {
    constructor(port = null, baudRate = 115200) {
        this.channelPort = null;
        this.portName = null;
        if (port) {
            this.connect(port, baudRate)
        }
    }

    connect(port, baudRate = 115200) {
        if (this.port) {
            this.disconnect();
        }
        this.portName = port;
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

        this.port.on('open', () => {
            this._answer({
                event: 'open',
                message: this.portName,
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
                message: {
                    disconnected: err !== null ? err.disconnected : true,
                    port: this.portName,
                }
            });

            this.disconnect();
        })
    }

    disconnect() {
        if (this.port && this.port.isOpen) {
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
            switch (event) {
                case 'color':
                    this.port.write(message);
                    break;
                case 'reset':
                    this.port.write("r\n");
                    break;
                default:
                    break;
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