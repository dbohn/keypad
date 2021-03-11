export default class NoAction {
    name() {
        return "Snippet";
    }

    params() {
        return [
            {
                name: "guild",
                label: "Gilde",
                type: "guild"
            },
            {
                name: "snippet",
                label: "Snippet",
                type: "snippet",
            },
        ];
    }

    handle(params, store) {
        store.dispatch('playSnippet', { snippetId: params.snippet, guildId: params.guild });
    }
}