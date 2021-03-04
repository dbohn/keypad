<template>
  <label class="py-2 flex items-center">
      <input class="mr-2" type="color" v-model="colorValue">
      {{ colorValue }}
  </label>
</template>
<script>
import Color from '../keypad/Color';

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

export default {
    name: "Colorpicker",
    computed: {
        colorValue: {
            get() {
                return this.value.toHex();
            },

            set: debounce(function (value) {
                this.$emit('input', Color.fromHex(value));
            }, 300)
        }
    },
    props: {
        value: {
            required: true,
        }
    }
}
</script>