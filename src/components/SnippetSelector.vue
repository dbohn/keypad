<template>
    <div>
        <label :for="fieldName" class="font-semibold mb-2 block">{{ fieldLabel }}</label>
        <div class="flex items-center">
            <snippet-creator></snippet-creator>
            <div class="flex items-center flex-1">
                <div class="relative flex-1">
                    <select :id="fieldName" class="shadow-sm py-2 pl-3 pr-7 rounded appearance-none block w-full focus:ring focus:outline-none" v-model="selectedSnippet">
                        <option :value="null">Snippet wählen...</option>
                        <option v-for="(snippet) in snippets" :key="`snippet_${snippet.id}`" :value="snippet.id">{{ snippet.name }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 pr-2 flex items-center">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div class="flex items-center ml-2" v-if="selectedSnippet && guild">
                    <button @click="play">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SnippetCreator from './SnippetCreator.vue';
export default {
    name: "SnippetSelector",

    props: {
        guild: {},
        value: {
            default: null,
        },
        config: {},
    },

    computed: {
        snippets() {
            return this.$store.state.snippets.snippets;
        },

        selectedSnippet: {
            get() {
                return this.value;
            },

            set(guild) {
                this.$emit('input', guild);
            }
        },

        fieldLabel() {
            return this.config.label;
        },

        fieldName() {
            return this.config.name;
        }
    },

    mounted() {
        this.$store.dispatch('loadSnippets');
    },

    methods: {
        play() {
            this.$store.dispatch('playSnippet', {snippetId: this.selectedSnippet, guildId: this.guild})
        }
    },

    components: { SnippetCreator },
}
</script>