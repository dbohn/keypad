<template>
    <button :style="hasColor ? `background-color: ${buttonColor}` : ''" :class="pressed ? 'ring' : ''" class="bg-gray-700 text-gray-100 rounded px-4" @click.left="$emit('click')" @click.right="$emit('configure')">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "Key",

    computed: {
        hasColor() {
            return !!this.config.color;
        },

        buttonColor() {
            const {r, g, b} = this.config.color;
            return `rgb(${r}, ${g}, ${b})`;
        },

        pressed() {
            return this.config.pressed;
        }
    },

    props: {
        config: {}
    },
}
</script>