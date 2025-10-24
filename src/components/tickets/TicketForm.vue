<template>
  <div class="ticket-form-overlay">
    <div class="ticket-form-container card">
      <h2>{{ ticket ? 'Edit Ticket' : 'Create New Ticket' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="ticket-form">
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input
            type="text"
            v-model="formData.title"
            :class="['form-input', { error: errors.title }]"
            placeholder="Enter ticket title"
            :disabled="submitting"
          />
          <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            v-model="formData.description"
            class="form-input"
            rows="4"
            placeholder="Enter ticket description"
            :disabled="submitting"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Status *</label>
            <select
              v-model="formData.status"
              :class="['form-input', { error: errors.status }]"
              :disabled="submitting"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <div v-if="errors.status" class="error-message">{{ errors.status }}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Priority</label>
            <select
              v-model="formData.priority"
              class="form-input"
              :disabled="submitting"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn btn-secondary" :disabled="submitting">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : (ticket ? 'Update Ticket' : 'Create Ticket') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'TicketFormComponent',
  props: {
    ticket: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const formData = reactive({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium'
    })

    const errors = reactive({})
    const submitting = ref(false)

    // Watch for ticket prop changes (when editing)
    watch(() => props.ticket, (newTicket) => {
      if (newTicket) {
        Object.assign(formData, {
          title: newTicket.title || '',
          description: newTicket.description || '',
          status: newTicket.status || 'open',
          priority: newTicket.priority || 'medium'
        })
      }
    }, { immediate: true })

    const validateForm = () => {
      const newErrors = {}
      
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required'
      }
      
      if (!formData.status) {
        newErrors.status = 'Status is required'
      } else if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
        newErrors.status = 'Invalid status value'
      }
      
      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      
      submitting.value = true
      try {
        await emit('submit', formData)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        submitting.value = false
      }
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      formData,
      errors,
      submitting,
      handleSubmit,
      handleCancel
    }
  }
}
</script>

<style scoped>
.ticket-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.ticket-form-container {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

.ticket-form {
  margin-top: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>