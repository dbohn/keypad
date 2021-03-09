export default class LogAction {
    name() {
        return "Daten in Log schreiben";
    }

    params() {
        return [
            {
                label: "Nachricht",
                type: "string",
                name: "message",
            }
        ];
    }

    handle(params) {
        console.log("Logging", params.message);
    }
}