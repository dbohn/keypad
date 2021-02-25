<template>
    <div id="app" class="antialiased font-sans flex flex-col min-h-screen max-h-screen overflow-hidden">
        <div class="flex-shrink-0 flex bg-gray-300 h-10 items-center px-2">
            <button class="text-blue-500 px-3 py-2 text-sm ml-auto flex items-center" @click.prevent="beginLoginProcess" v-if="authState === 'unauthenticated'">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Botintegration aktivieren
            </button>
            <user-info v-if="authState === 'authenticated'"></user-info>
        </div>
        <div class="flex flex-1 overflow-hidden">
            <div class="flex-1 p-3">
                <keypad :actions="actions" @configure="configureAction"></keypad>
            </div>
            <div class="bg-gray-200 overflow-auto w-1/3 p-3">
                <action-configuration :button-id="configuredAction" v-model="configuredActionConfig" v-if="configuredAction !== null"></action-configuration>
            </div>
        </div>
    </div>
</template>
<script>
import ActionConfiguration from './components/ActionConfiguration.vue';
import Keypad from './components/Keypad.vue';
import UserInfo from './components/UserInfo.vue';
import ButtonConfiguration from './keypad/ButtonConfiguration';

export default {
    name: 'App',

    data() {
        return {
            actions: new ButtonConfiguration(this.$store),
            configuredAction: null,
            port: null,
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

        authState() {
            return this.$store.state.auth.state;
        }
    },

    mounted() {
        this.$store.dispatch('checkAvailableAccessToken').catch(() => {});

        const { port1, port2 } = new MessageChannel();
        window.ipcRenderer.postMessage('serial:open', { port: 'COM4' }, [port1]);

        this.port = port2;

        this.port.onmessage = (evt) => {
            console.log(evt.data);
            if (evt.data.event === 'receive' && evt.data.message === "u3") {
                console.log(evt.data);
                this.actions.trigger(4);
            }
        }
    },

    methods: {
        configureAction(buttonId) {
            this.configuredAction = buttonId;
        },

        beginLoginProcess() {
            this.$store.dispatch('login');
        },
    },

    components: {
        Keypad,
        ActionConfiguration,
        UserInfo
    },
}
</script>
