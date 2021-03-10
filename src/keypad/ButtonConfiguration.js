import ActionCollection from "../ActionCollection";
import Color from "./Color";

import Vue from 'vue';

export class Button {
    constructor(type, color, params = {}) {
        this.type = type;
        this.color = color;
        this.params = params;

        this.pressed = false;
    }

    static default() {
        return new Button("NoAction", Color.fromHex('#000000'));
    }

    static fromButton(button) {
        return new Button(button.type, button.color, button.params);
    }

    static fromStore(storedConfig) {
        return new Button(storedConfig.type, new Color(storedConfig.color), storedConfig.params);
    }

    setType(type) {
        this.type = type;
        this.params = {};
    }

    serialColorCommand(id) {
        return `c${id},${this.color.toSerial()}\n`;
    }

    toJSON() {
        return {
            type: this.type,
            color: this.color,
            params: this.params,
        };
    }
}

export default class ButtonConfiguration {
    constructor(config = null) {
        this.config = config || {
            1: new Button("LogAction", new Color({r: 255}), {message: "Hello World"}),
            2: new Button("NoAction", new Color({g: 255})),
            3: new Button("ShellAction", new Color({ b: 255 }), {command: ['whoami']}),
        }
    }

    static fromStorage(config) {
        for (let key in config) {
            config[key] = Button.fromStore(config[key]);
        }

        return new ButtonConfiguration(config);
    }

    trigger(button, store = null) {
        const buttonConfig = this.getConfig(button);
        buttonConfig.pressed = false;
        this.setConfig(button, buttonConfig);
        const action = new (this.resolveAction(buttonConfig.type));

        return action.handle(buttonConfig.params, store);
    }

    resolveAction(type) {
        return ActionCollection[type] || ActionCollection["NoAction"];
    }

    serialColors() {
        return Object.keys(this.config).map((button) => {
            return this.config[button].serialColorCommand(button - 1);
        });
    }

    /**
     *
     * @param {int} button
     * @returns {Button}
     */
    getConfig(button) {
        return this.config[button] || Button.default();
    }

    setConfig(button, config) {
        Vue.set(this.config, button, config);

        return this;
    }

    setButtonPressed(button, state = true) {
        const buttonConfig = this.getConfig(button);
        buttonConfig.pressed = state;
        this.setConfig(button, buttonConfig);
    }

    setButtonReleased(button) {
        this.setButtonPressed(button, false);
    }

    colorChanged(button, config) {
        const currentConfig = this.getConfig(button);
        return !currentConfig.color.equals(config.color);
    }

    toJSON() {
        return this.config;
    }
}