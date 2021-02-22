<template>
  <div>
      <input type="color" v-model="colorValue">
  </div>
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