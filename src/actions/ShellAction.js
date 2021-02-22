export default class ShellAction {
    name() {
        return "Shell-Befehl";
    }

    params() {
        return [
            {
                label: "Command to execute",
                type: "string",
                name: "command",
            }
        ];
    }

    handle(params) {
        window.ipcRenderer.invoke("shell-action:invoke", params.command);
    }
}