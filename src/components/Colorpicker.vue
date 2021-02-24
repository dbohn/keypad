<template>
  <label class="py-2 flex items-center">
      <input class="mr-2" type="color" v-model="colorValue">
      {{ colorValue }}
  </label>
</template>
<script>
import Color from '../keypad/Color';
export default {
    name: "Colorpicker",
    computed: {
        colorValue: {
            get() {
                return this.value.toHex();
            },

            set(value) {
                this.$emit('input', Color.fromHex(value));
            }
        }
    },
    props: {
        value: {
            required: true,
        }
    }
}
</script>