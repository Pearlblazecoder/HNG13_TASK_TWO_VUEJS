<template>
  <slot v-if="isAuthenticated" />
  <div v-else class="loading">Redirecting...</div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'RouteGuard',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const isAuthenticated = computed(() => {
      if (!authStore.isAuthenticated) {
        router.replace('/auth/login')
        return false
      }
      return true
    })

    return {
      isAuthenticated
    }
  }
}
</script>