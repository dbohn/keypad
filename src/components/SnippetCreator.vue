<template>
  <div>
      <input type="file" @change="selectFile" accept="audio/*" class="hidden" ref="fileInput">
      <div class="flex items-center">
        <button class="bg-gray-700 text-gray-100 px-3 py-2 rounded shadow mr-2" @click="openFilePicker">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </button>
        <audio-preview :file="file" v-if="file !== null"></audio-preview>
        <button class="bg-gray-700 text-gray-100 px-3 py-2 rounded shadow mr-2" v-if="file !== null" @click="createSnippet">Create</button>
      </div>
  </div>
</template>

<script>
import AudioPreview from './AudioPreview.vue';
export default {
  components: { AudioPreview },
    name: "SnippetCreator",

    computed: {
        file: {
            get() {
                return this.$store.state.snippets.newSnippet.file;
            },

            set(file) {
                this.$store.commit('selectSnippetFile', {file});
            }
        }
    },

    methods: {
        selectFile(e) {
            if (e.target.files.length === 0) {
                return;
            }

            if (e.target.files[0].size > 2*1024*1024) {
                alert("Die Datei darf maximal 2 MB groß sein!");
                return;
            }

            this.file = e.target.files[0];
        },

        openFilePicker() {
            this.$refs.fileInput.click();
        },

        createSnippet() {
            this.$store.dispatch('createSnippet').then((response) => {
                this.$store.dispatch('loadSnippets');
                this.$emit('input', response.data);
            });
        }
    },
}
</script>