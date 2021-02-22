<template>
    <div id="app" class="antialiased flex min-h-screen font-sans">
        <div class="flex-1 p-3">
            <keypad :actions="actions" @configure="configureAction"></keypad>
        </div>
        <div class="bg-gray-200 w-1/3 p-3">
            <action-configuration :button-id="configuredAction" v-model="configuredActionConfig" v-if="configuredAction !== null"></action-configuration>
        </div>
    </div>
</template>
<script>
import ActionConfiguration from './components/ActionConfiguration.vue';
import Keypad from './components/Keypad.vue';
import ButtonConfiguration from './keypad/ButtonConfiguration';
import Color from './keypad/Color';

export default {
    name: 'App',

    data() {
        return {
            testColor: new Color({r: 255}),
            actions: new ButtonConfiguration(),
            configuredAction: null,
        };
    },

    computed: {
        configuredActionConfig: {
            get() {
                return this.actions.getConfig(this.configuredAction);
            },

            set(config) {
                if (this.configuredAction === null) {
                    return;
                }

                this.actions.setConfig(this.configuredAction, config);
            }
        },
    },

    methods: {
        configureAction(buttonId) {
            console.log("Configure", buttonId);
            this.configuredAction = buttonId;
        }
    },

    components: {
        Keypad,
        ActionConfiguration
    },
}
</script>
