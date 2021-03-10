<template>
  <div>
      <input type="file" @change="selectFile" accept="audio/*" class="hidden" ref="fileInput">
      <div class="flex items-center">
        <button class="text-gray-100 p-3 rounded shadow mr-2" :class="{'bg-gray-400': uploading, 'bg-gray-700': !uploading}" @click="openFilePicker" :disabled="uploading">
            <spinner class="w-4 h-4" v-if="uploading"></spinner>
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-else>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </button>
      </div>
  </div>
</template>

<script>
import Spinner from './Spinner.vue';
export default {
    components: { Spinner },
    name: "SnippetCreator",

    data() {
        return {
            uploading: false,
        }
    },

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

            this.$nextTick(() => this.createSnippet());
        },

        openFilePicker() {
            this.$refs.fileInput.click();
        },

        createSnippet() {
            this.uploading = true;
            this.$store.dispatch('createSnippet').then((response) => {
                this.$store.dispatch('loadSnippets');
                this.$emit('input', response.data);
            }).finally(() => this.uploading = false);
        }
    },
}
</script>