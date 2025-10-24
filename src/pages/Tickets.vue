<template>
  <div class="tickets-page">
    <div class="container">
      <header class="tickets-header">
        <h1>Ticket Management</h1>
        <button 
          @click="showForm = true"
          class="btn btn-primary"
        >
          Create Ticket
        </button>
      </header>

      <TicketForm
        v-if="showForm"
        :ticket="editingTicket"
        @submit="handleFormSubmit"
        @cancel="handleCancelForm"
      />

      <TicketList
        :tickets="ticketsStore.tickets"
        @edit="handleEditTicket"
        @delete="handleDeleteTicket"
      />
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
import { ref, onMounted } from 'vue'
import { useTicketsStore } from '../stores/tickets'
import TicketForm from '../components/tickets/TicketForm.vue'
import TicketList from '../components/tickets/TicketList.vue'
import Toast from '../components/common/Toast.vue'

export default {
  name: 'TicketsPage',
  components: {
    TicketForm,
    TicketList,
    Toast
  },
  setup() {
    const ticketsStore = useTicketsStore()

    const showForm = ref(false)
    const editingTicket = ref(null)
    const toast = ref(null)

    const loadTickets = async () => {
      try {
        await ticketsStore.fetchTickets()
      } catch (error) {
        // Use the error variable by passing it to showToast or logging it
        showToast('Failed to load tickets: ' + error.message, 'error')
        console.error('Failed to load tickets:', error)
      }
    }

    const handleCreateTicket = async (ticketData) => {
      const result = await ticketsStore.createTicket(ticketData)
      if (result.success) {
        showToast('Ticket created successfully!', 'success')
      } else {
        showToast('Failed to create ticket: ' + result.error, 'error')
      }
      return result.success
    }

    const handleUpdateTicket = async (ticketData) => {
      const result = await ticketsStore.updateTicket(editingTicket.value.id, ticketData)
      if (result.success) {
        showToast('Ticket updated successfully!', 'success')
      } else {
        showToast('Failed to update ticket: ' + result.error, 'error')
      }
      return result.success
    }

    const handleFormSubmit = async (ticketData) => {
      let success = false
      
      if (editingTicket.value) {
        success = await handleUpdateTicket(ticketData)
      } else {
        success = await handleCreateTicket(ticketData)
      }

      if (success) {
        showForm.value = false
        editingTicket.value = null
      }
    }

    const handleEditTicket = (ticket) => {
      editingTicket.value = ticket
      showForm.value = true
    }

    const handleDeleteTicket = async (ticketId) => {
      if (!confirm('Are you sure you want to delete this ticket?')) {
        return
      }

      const result = await ticketsStore.deleteTicket(ticketId)
      if (result.success) {
        showToast('Ticket deleted successfully!', 'success')
      } else {
        showToast('Failed to delete ticket: ' + result.error, 'error')
      }
    }

    const handleCancelForm = () => {
      showForm.value = false
      editingTicket.value = null
    }

    const showToast = (message, type) => {
      toast.value = { message, type }
    }

    onMounted(() => {
      loadTickets()
    })

    return {
      ticketsStore,
      showForm,
      editingTicket,
      toast,
      handleFormSubmit,
      handleEditTicket,
      handleDeleteTicket,
      handleCancelForm
    }
  }
}
</script>

<style scoped>
.tickets-page {
  padding: 2rem 0;
}

.tickets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tickets-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>