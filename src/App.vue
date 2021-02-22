<template>
    <div id="app" class="antialiased flex min-h-screen">
        <div class="flex-1 p-3">
            <keypad></keypad>
        </div>
        <div class="bg-gray-200 w-1/3 p-3">
            <h3 class="text-gray-600 font-semibold tracking-wide">Button 3 bearbeiten</h3>
            <div>
                <colorpicker v-model="testColor"></colorpicker>
            </div>
        </div>
    </div>
</template>
<script>
import Colorpicker from './components/Colorpicker.vue';
import Keypad from './components/Keypad.vue';
import Color from './keypad/Color';

export default {
    name: 'App',

    data() {
        return {
            testColor: new Color({r: 255}),
        };
    },

    components: {
        Keypad,
        Colorpicker
    },
}
</script>
