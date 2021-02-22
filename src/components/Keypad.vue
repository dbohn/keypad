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
import Keypad from "../keypad/Keypad";

export default {
    data() {
        return {
            actions: new Keypad(),
        }
    },

    components: { Key },
    name: "Keypad",

    methods: {
        triggerAction(i) {
            this.actions.trigger(i);
        },

        configure(i) {
            console.log("Configure button ", i);
        }
    },
}
</script>