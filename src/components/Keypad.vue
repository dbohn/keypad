<template>
    <div class="grid grid-cols-4 grid-rows-4 gap-2 h-full">
        <key
            v-for="i in 16" :key="`key_${i}`" :config="actions.getConfig(i)"
            @click="triggerAction(i)" @configure="configure(i)">
            <template #default="{config}">
                <div class="text-xl">
                    {{ i }}
                </div>
                <div class="overflow-ellipsis w-full overflow-hidden whitespace-nowrap text-sm">{{ config.label }}</div>
            </template>
        </key>
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
        const callback = (event) => {
            if (event.isUp()) {
                this.triggerAction(event.buttonNumber);
                this.actions.setButtonReleased(event.buttonNumber);
            } else {
                this.actions.setButtonPressed(event.buttonNumber);
            }
        };

        this.serialFrontend.on('receive', callback);

        this.$on('hook:destroyed', () => {
            this.serialFrontend.off('receive', callback);
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