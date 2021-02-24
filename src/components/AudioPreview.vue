<template>
  <div v-if="url !== null">
        <audio :src="url" ref="playback"></audio>
        <button @click="play">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
  </div>
</template>
<script>
export default {
    name: "AudioPreview",

    data() {
        return {
            url: null,
            playing: false,
        }
    },

    props: {
        file: {
            required: true,
        },
    },

    watch: {
        file: {
            immediate: true,
            handler() {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    this.url = evt.target.result;
                };
                reader.readAsDataURL(this.file);
            }
        }
    },

    computed: {
        type() {
            return this.file.type;
        }
    },

    methods: {
        play() {
            if (this.$refs.playback.paused) {
                this.$refs.playback.play();
                this.playing = true;
            } else {
                this.$refs.playback.pause();
                this.playing = false;
            }
        }
    }
}
</script>