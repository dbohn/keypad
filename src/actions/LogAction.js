export default class LogAction {
    name() {
        return "Log Action";
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