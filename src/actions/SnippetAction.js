export default class NoAction {
    name() {
        return "Snippet";
    }

    params() {
        return [
            {
                name: "snippet",
                label: "Snippet",
                type: "snippet",
            },
            {
                name: "guild",
                label: "Gilde",
                type: "guild"
            }
        ];
    }

    handle(params, store) {
        store.dispatch('playSnippet', { snippetId: params.snippet, guildId: params.guild });
    }
}