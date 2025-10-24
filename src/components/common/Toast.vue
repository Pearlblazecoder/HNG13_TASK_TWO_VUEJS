<template>
  <div v-if="visible" :class="['toast', type]">
    <div class="toast-content">
      <span>{{ message }}</span>
      <button @click="close" class="toast-close">×</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ToastNotification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const visible = ref(true)

    const close = () => {
      visible.value = false
      emit('close')
    }

    onMounted(() => {
      if (props.duration > 0) {
        setTimeout(() => {
          close()
        }, props.duration)
      }
    })

    return {
      visible,
      close
    }
  }
}
</script>