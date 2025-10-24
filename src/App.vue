<template>
  <div id="app">
    <AppHeader />  <!-- Changed from <Header /> to <AppHeader /> -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/common/Header.vue'  // Import name updated

export default {
  name: 'App',
  components: {
    AppHeader  // Component registration updated
  },
  setup() {
    const authStore = useAuthStore()

    onMounted(() => {
      authStore.checkAuth()
    })

    return {}
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>