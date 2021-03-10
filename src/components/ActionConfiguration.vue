<template>
    <div>
        <h3 class="text-gray-600 font-semibold text-lg">Button {{ buttonId }} bearbeiten</h3>
        <div class="my-2 border-b border-gray-400">
            <span class="font-semibold">Buttonfarbe</span>
            <colorpicker v-model="color"></colorpicker>
        </div>
        <div class="my-2 border-b border-gray-400">
            <label class="font-semibold mb-2 block" for="action-selection">Aktion</label>
            <div class="relative mb-2">
                <select id="action-selection" class="shadow-sm py-2 px-3 rounded appearance-none block w-full" v-model="actionType">
                    <option v-for="(item, key) in actionCollection" :key="`action_${key}`" :value="key">{{ actionLabel(item) }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 pr-2 flex items-center">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
        <div v-for="param in currentAction.params()" :key="`param_${param.name}`">
            <component class="py-2 my-2 border-b border-gray-400" :is="typeToComponentMap[param.type]" :config="param" :value="value.params[param.name]" @input="updateParam(param, $event)"></component>
        </div>
    </div>
</template>

<script>
import { Button } from '../keypad/ButtonConfiguration';
import Colorpicker from './Colorpicker.vue';

import ActionCollection from "../ActionCollection";
import SnippetSelector from './SnippetSelector.vue';
import GuildSelector from './GuildSelector.vue';
import StringInput from './StringInput.vue';

export default {
    name: "ActionConfiguration",

    data() {
        return {
            actionCollection: ActionCollection,
            guild: null,
            typeToComponentMap: {
                snippet: SnippetSelector,
                guild: GuildSelector,
                string: StringInput,
            },
        };
    },

    components: {
        Colorpicker,
    },

    computed: {
        color: {
            get() {
                return this.value.color;
            },

            set(color) {
                this.updateButton((button) => button.color = color);
            }
        },

        actionType: {
            get() {
                return this.value.type;
            },

            set(type) {
                this.updateButton((button) => button.setType(type));
            }
        },

        currentAction() {
            const action = this.actionCollection[this.actionType];
            return new action();
        }
    },

    methods: {
        actionLabel(action) {
            return (new action()).name();
        },

        updateButton(callback) {
            const button = Button.fromButton(this.value);
            callback(button);
            this.$emit('input', button);
        },

        updateParam(param, value) {
            this.updateButton((button) => button.params[param.name] = value);
        }
    },

    props: {
        buttonId: {},
        value: {},
    },
}
</script>