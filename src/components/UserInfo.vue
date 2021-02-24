<template>
  <div class="ml-auto flex items-center">
      <span class="text-sm font-mono" v-if="userInfo">
        {{ userInfo.username }}#{{ userInfo.discriminator }}
      </span>
      <button class="flex items-center text-blue-500 px-3 py-2 text-sm" @click="logout">
            <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Abmelden
      </button>
  </div>
</template>

<script>
export default {
    name: "UserInfo",

    computed: {
        userInfo() {
            return this.$store.state.auth.userInfo;
        },
    },

    mounted() {
        this.$store.dispatch('loadUserInfo');
    },

    methods: {
        logout() {
            this.$store.dispatch('logout');
        }
    },
}
</script>