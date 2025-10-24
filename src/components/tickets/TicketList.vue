<template>
  <div class="ticket-list">
    <div v-if="tickets.length === 0" class="empty-state card">
      <h3>No tickets found</h3>
      <p>Create your first ticket to get started!</p>
    </div>

    <div v-else>
      <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card card">
        <div class="ticket-header">
          <h3 class="ticket-title">{{ ticket.title }}</h3>
          <div class="ticket-actions">
            <button 
              @click="handleEdit(ticket)"
              class="btn-action edit"
              aria-label="Edit ticket"
            >
              ✏️
            </button>
            <button 
              @click="handleDelete(ticket.id)"
              class="btn-action delete"
              aria-label="Delete ticket"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <p v-if="ticket.description" class="ticket-description">{{ ticket.description }}</p>
        
        <div class="ticket-meta">
          <span :class="['status-badge', `status-${ticket.status}`]">
            {{ ticket.status.replace('_', ' ') }}
          </span>
          <span class="ticket-priority">Priority: {{ ticket.priority }}</span>
          <span class="ticket-date">
            Created: {{ formatDate(ticket.createdAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TicketListComponent',
  props: {
    tickets: {
      type: Array,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const handleEdit = (ticket) => {
      emit('edit', ticket)
    }

    const handleDelete = (ticketId) => {
      emit('delete', ticketId)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    return {
      handleEdit,
      handleDelete,
      formatDate
    }
  }
}
</script>

<style scoped>
.ticket-list {
  display: grid;
  gap: 1.5rem;
}

.ticket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.ticket-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  flex: 1;
  margin-right: 1rem;
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;
}

.btn-action:hover {
  background-color: var(--border-color);
}

.ticket-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.ticket-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.ticket-priority,
.ticket-date {
  padding: 0.25rem 0.5rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .ticket-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .ticket-actions {
    align-self: flex-end;
  }
}
</style>