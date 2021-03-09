<template>
    <div class="grid grid-cols-4 grid-rows-4 gap-2 h-full">
        <key
            class="bg-gray-700 text-gray-100 rounded px-4"
            v-for="i in 16" :key="`key_${i}`" :config="actions.getConfig(i)"
            @click="triggerAction(i)" @configure="configure(i)">{{ i }}</key>
    </div>
</template>
<script>
import Key from './Key.vue';
import ButtonConfiguration from "../keypad/ButtonConfiguration";

export default {

    props: {
        actions: {
            default: () => (new ButtonConfiguration()),
        },
    },

    computed: {
        serialFrontend() {
            return this.$store.state.serial.frontend;
        }
    },

    mounted() {
        this.serialFrontend.on('receive', (event) => {
            if (event.isUp()) {
                this.triggerAction(event.buttonNumber);
                this.actions.setButtonReleased(event.buttonNumber);
            } else {
                this.actions.setButtonPressed(event.buttonNumber);
            }
        });
    },

    components: { Key },
    name: "Keypad",

    methods: {
        triggerAction(i) {
            this.actions.trigger(i, this.$store);
        },

        configure(i) {
            this.$emit('configure', i);
        }
    },
}
</script>