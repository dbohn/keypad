<template>
    <div id="app" class="antialiased font-sans flex flex-col min-h-screen max-h-screen overflow-hidden">
        <div class="flex-shrink-0 flex bg-gray-300 h-10 items-center px-2">
            <div>
                <serial-port-list @connect="connect" v-if="!connected"></serial-port-list>
                <div class="px-2 font-semibold text-gray-800" v-else>
                    Verbunden über Port {{ currentPort }}
                </div>
            </div>
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
                <div class="h-full flex items-center" v-else>
                    <p class="text-xl text-gray-800 leading-normal text-center">Um einen Button zu konfigurieren, wählen Sie den Button mit einem Rechtsklick!</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ActionConfiguration from './components/ActionConfiguration.vue';
import Keypad from './components/Keypad.vue';
import SerialPortList from './components/SerialPortList.vue';
import UserInfo from './components/UserInfo.vue';
import ButtonConfiguration from './keypad/ButtonConfiguration';

export default {
    name: 'App',

    data() {
        return {
            configuredAction: null,
        };
    },

    computed: {
        actions() {
            return this.$store.state.keypad.actions;
        },

        configuredActionConfig: {
            get() {
                return this.actions.getConfig(this.configuredAction);
            },

            set(config) {
                if (this.configuredAction === null) {
                    return;
                }

                if (this.actions.colorChanged(this.configuredAction, config)) {
                    this.serialFrontend.emit('color', config.serialColorCommand(this.configuredAction - 1));
                }

                this.$store.commit('setKeypadAction', {action: this.configuredAction, config});
            }
        },

        connected() {
            return this.$store.state.serial.connected;
        },

        authState() {
            return this.$store.state.auth.state;
        },

        serialFrontend() {
            return this.$store.state.serial.frontend;
        },

        currentPort() {
            return this.$store.state.serial.currentPort;
        }
    },

    mounted() {
        this.$store.dispatch('checkAvailableAccessToken').catch(() => {});

        this.serialFrontend.on('open', (port) => {
            this.$store.commit('connectSerialPort', {connected: true, port});

            this.sendColors();
        });

        this.serialFrontend.on('close', () => {
            this.$store.commit('connectSerialPort', {connected: false});
        });

        console.log(ButtonConfiguration.fromStorage(JSON.parse(JSON.stringify(this.actions))));
    },

    methods: {
        connect(port) {
            this.serialFrontend.openConnection(window.ipcRenderer, port);
        },

        configureAction(buttonId) {
            this.configuredAction = buttonId;
        },

        beginLoginProcess() {
            this.$store.dispatch('login');
        },

        async sendColors() {
            for (let color of this.actions.serialColors()) {
                this.serialFrontend.emit('color', color);
            }
        },
    },

    components: {
        Keypad,
        ActionConfiguration,
        UserInfo,
        SerialPortList
    },
}
</script>