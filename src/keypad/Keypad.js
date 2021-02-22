import ActionCollection from "../ActionCollection";
import Color from "./Color";

export default class Keypad {
    constructor() {
        this.config = {
            1: {
                type: "LogAction",
                color: new Color({r: 255}),
                params: {
                    message: "Hello World",
                },
            },
            2: {
                type: "NoAction",
                color: new Color({g: 255}),
            },
            3: {
                type: "ShellAction",
                color: new Color({b: 255}),
                params: {
                    command: [
                        "say",
                        "Hallo Welt",
                    ],
                }
            }
        }
    }

    trigger(button) {
        const buttonConfig = this.config[button] || {
            type: "NoAction",
            params: {}
        };
        const action = new (this.resolveAction(buttonConfig.type));

        return action.handle(buttonConfig.params);
    }

    resolveAction(type) {
        return ActionCollection[type] || ActionCollection["NoAction"];
    }

    getConfig(button) {
        return this.config[button] || {
            color: new Color({}),
        };
    }
}