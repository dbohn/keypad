<template>
    <button :style="hasColor ? `background-color: ${buttonColor}` : ''" :class="pressed ? 'ring' : ''" class="rounded-lg p-3 flex items-stretch justify-center" @click.left="$emit('click')" @click.right="$emit('configure')">
        <div class="bg-white bg-opacity-70 flex flex-col items-center w-full justify-center text-gray-800 rounded font-semibold p-1">
            <slot :config="config"></slot>
        </div>
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