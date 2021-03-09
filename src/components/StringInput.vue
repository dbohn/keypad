<template>
    <div>
        <label class="font-semibold mb-2 block" :for="fieldName">{{ fieldLabel }}</label>
        <input class="shadow-sm py-2 px-3 rounded appearance-none block w-full focus:ring focus:outline-none" :id="fieldName" type="text" v-model=fieldValue>
    </div>
</template>

<script>
export default {
    props: {
        config: {},
        value: {},
    },

    computed: {
        fieldName() {
            return this.config.name;
        },

        fieldLabel() {
            return this.config.label;
        },

        fieldValue: {
            get() {
                return this.value;
            },

            set(value) {
                this.$emit('input', value);
            }
        }
    },
}
</script>