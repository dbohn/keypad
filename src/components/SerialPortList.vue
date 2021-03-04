<template>
    <div class="flex items-center">
        <button class="inline-flex items-center justify-center" @click.prevent="refreshPorts">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
        </button>
        <div class="relative mx-2">
            <select class="shadow-sm py-1 pl-3 pr-8 rounded appearance-none block w-full" v-model="selectedPort">
                <option :value="null">Serielle Schnittstelle wählen...</option>
                <option :value="path" v-for="{path, manufacturer} in ports" :key="`port_${path}`">{{ path }} [{{ manufacturer }}]</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 pr-2 flex items-center">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
        <button class="bg-gray-800 rounded px-3 py-1 text-white font-semibold" :disabled="selectedPort === null" @click.prevent="$emit('connect', selectedPort)">
            Connect
        </button>
    </div>
</template>

<script>
export default {
    name: "SerialPortList",

    data() {
        return {
            selectedPort: null,
        }
    },

    computed: {
        ports() {
            return this.$store.state.serial.ports;
        }
    },

    mounted() {
        this.refreshPorts();
    },

    methods: {
        refreshPorts() {
            this.$store.dispatch('listSerialPorts').then(() => {

            });
        }
    }
}
</script>