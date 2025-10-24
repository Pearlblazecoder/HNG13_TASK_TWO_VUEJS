<template>
  <header class="header" v-if="!isAuthPage">
    <div class="container">
      <nav class="nav">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h2>FlexiTicket</h2>
          </router-link>
        </div>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/tickets" class="nav-link">Tickets</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AppHeader',  // Changed from 'Header' to 'AppHeader'
  setup() {
    const route = useRoute()
    
    const isAuthPage = computed(() => {
      return route.path.includes('/auth')
    })

    return {
      isAuthPage
    }
  }
}
</script>