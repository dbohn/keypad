<template>
    <div>
        <h3 class="text-gray-600 font-semibold tracking-wide">Button {{ buttonId }} bearbeiten</h3>
        <div>
            <colorpicker v-model="color"></colorpicker>
        </div>
        <div>
            <select>
                <option v-for="(item, key) in actionCollection" :key="`action_${key}`" :value="key">{{ actionLabel(item) }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import { Button } from '../keypad/ButtonConfiguration';
import Colorpicker from './Colorpicker.vue';

import ActionCollection from "../ActionCollection";

export default {
    name: "ActionConfiguration",

    data() {
        return {
            actionCollection: ActionCollection,
        };
    },

    components: {
        Colorpicker
    },

    computed: {
        color: {
            get() {
                return this.value.color;
            },

            set(color) {
                const button = Button.fromButton(this.value);
                button.color = color;
                this.$emit('input', button);
            }
        },
    },

    methods: {
        actionLabel(action) {
            return (new action()).name();
        }
    },

    props: {
        buttonId: {},
        value: {},
    },
}
</script>