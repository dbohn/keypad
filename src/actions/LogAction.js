export default class LogAction {
    name() {
        return "Daten in Log schreiben";
    }

    params() {
        return [
            {
                label: "Message",
                type: "string",
                name: "message",
            }
        ];
    }

    handle(params) {
        console.log("Logging", params.message);
    }
}