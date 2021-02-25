export default class NoAction {
    name() {
        return "Snippet";
    }

    params() {
        return [];
    }

    handle(params, store) {
        store.dispatch('playSnippet', { snippetId: "5", guildId: "320306499375333387" })
    }
}