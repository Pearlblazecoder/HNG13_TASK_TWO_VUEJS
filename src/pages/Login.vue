<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to your TicketFlow account</p>
        
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :class="['form-input', { error: errors.email }]"
              placeholder="Enter your email"
            />
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              :class="['form-input', { error: errors.password }]"
              placeholder="Enter your password"
            />
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary auth-button"
            :disabled="loading"
          >
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
        
        <p class="auth-switch">
          Don't have an account? <router-link to="/auth/signup" class="auth-link">Sign up</router-link>
        </p>
      </div>
    </div>
    
    <Toast 
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Toast from '../components/common/Toast.vue'
export default {
  name: 'LoginPage',
  components: {
    Toast
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const formData = reactive({
      email: '',
      password: ''
    })

    const errors = reactive({})
    const loading = ref(false)
    const toast = ref(null)

    const validateForm = () => {
      const newErrors = {}
      
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
      
      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      loading.value = true
      try {
        const result = await authStore.login(formData)
        if (result.success) {
          toast.value = { message: 'Login successful!', type: 'success' }
          setTimeout(() => router.push('/dashboard'), 1000)
        } else {
          toast.value = { message: result.error, type: 'error' }
        }
      } catch (error) {
        toast.value = { message: error.message, type: 'error' }
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      errors,
      loading,
      toast,
      handleSubmit
    }
  }
}
</script>