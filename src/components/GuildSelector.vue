<template>
    <div>
        <label class="font-semibold mb-2 block" :for="fieldName">{{ fieldLabel }}</label>
        <div class="relative">
            <select :id="fieldName" class="shadow-sm py-2 pl-3 pr-7 rounded appearance-none block w-full focus:ring focus:outline-none" v-model="selectedGuild">
                <option :value="null">Gilde wählen...</option>
                <option v-for="(guild) in guilds" :key="`guild_${guild.id}`" :value="guild.id">{{ guild.name }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 pr-2 flex items-center">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "GuildSelector",

    data() {
        return {
        }
    },

    props: {
        value: {
            default: null,
        },

        config: {}
    },

    computed: {
        guilds() {
            return this.$store.state.guilds.guilds;
        },

        selectedGuild: {
            get() {
                return this.value;
            },

            set(guild) {
                this.$emit('input', guild);
            }
        },

        fieldLabel() {
            return this.config.label;
        },

        fieldName() {
            return this.config.name;
        }
    },

    watch: {
        selectedGuild: {
            immediate: true,
            handler() {
                if (this.selectedGuild === null && this.guilds.length === 1) {
                    this.selectedGuild = this.guilds[0].id;
                }
            }
        }
    },

    mounted() {
        this.$store.dispatch('loadGuilds');
    }
}
</script>