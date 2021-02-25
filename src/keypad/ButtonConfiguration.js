import ActionCollection from "../ActionCollection";
import Color from "./Color";

import Vue from 'vue';

export class Button {
    constructor(type, color, params = {}) {
        this.type = type;
        this.color = color;
        this.params = params;
    }

    static default() {
        return new Button("NoAction", Color.fromHex('#000000'));
    }

    static fromButton(button) {
        return new Button(button.type, button.color, button.params);
    }

    setType(type) {
        this.type = type;
        this.params = {};
    }
}

export default class ButtonConfiguration {
    constructor(store) {
        this.config = {
            1: new Button("LogAction", new Color({r: 255}), {message: "Hello World"}),
            2: new Button("NoAction", new Color({g: 255})),
            3: new Button("ShellAction", new Color({ b: 255 }), {command: ['whoami']}),
            4: new Button("SnippetAction", new Color({r: 255}))
        }

        this.store = store;
    }

    trigger(button) {
        const buttonConfig = this.getConfig(button);
        const action = new (this.resolveAction(buttonConfig.type));

        return action.handle(buttonConfig.params, this.store);
    }

    resolveAction(type) {
        return ActionCollection[type] || ActionCollection["NoAction"];
    }

    getConfig(button) {
        return this.config[button] || Button.default();
    }

    setConfig(button, config) {
        Vue.set(this.config, button, config);

        return this;
    }
}