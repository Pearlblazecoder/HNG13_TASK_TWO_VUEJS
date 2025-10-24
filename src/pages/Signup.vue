<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join TicketFlow today</p>
        
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              :class="['form-input', { error: errors.name }]"
              placeholder="Enter your full name"
            />
            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
          </div>
          
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
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :class="['form-input', { error: errors.confirmPassword }]"
              placeholder="Confirm your password"
            />
            <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary auth-button"
            :disabled="loading"
          >
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>
        
        <p class="auth-switch">
          Already have an account? <router-link to="/auth/login" class="auth-link">Sign in</router-link>
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
  name: 'SignupPage',
  components: {
    Toast
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const formData = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const errors = reactive({})
    const loading = ref(false)
    const toast = ref(null)

    const validateForm = () => {
      const newErrors = {}
      
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
      }
      
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
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      
      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      loading.value = true
      try {
        const result = await authStore.signup(formData)
        if (result.success) {
          toast.value = { message: 'Account created successfully!', type: 'success' }
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