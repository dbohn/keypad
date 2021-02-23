<template>
    <div id="app" class="antialiased flex min-h-screen font-sans">
        <div class="flex-1 p-3">
            <keypad :actions="actions" @configure="configureAction"></keypad>
        </div>
        <div class="bg-gray-200 w-1/3 p-3">
            <button class="bg-gray-800 text-gray-100 px-3 py-2 rounded" @click.prevent="beginLoginProcess">Login to Bot</button>
            <action-configuration :button-id="configuredAction" v-model="configuredActionConfig" v-if="configuredAction !== null"></action-configuration>
        </div>
    </div>
</template>
<script>
import ActionConfiguration from './components/ActionConfiguration.vue';
import Keypad from './components/Keypad.vue';
import ButtonConfiguration from './keypad/ButtonConfiguration';

export default {
    name: 'App',

    data() {
        return {
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
        },

        beginLoginProcess() {
            window.ipcRenderer.invoke("authentication:start").then((result) => {
                console.log("Authenticated", result);
            }).catch((error) => {
                console.log(error);
            });
        },
    },

    components: {
        Keypad,
        ActionConfiguration
    },
}
</script>
