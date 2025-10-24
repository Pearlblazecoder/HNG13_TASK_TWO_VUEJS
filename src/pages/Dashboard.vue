<template>
  <div class="dashboard-page">
    <div class="container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <button @click="handleLogout" class="btn btn-secondary">
          Logout
        </button>
      </header>

      <div class="stats-grid">
        <div class="stat-card card">
          <h3>Total Tickets</h3>
          <div class="stat-number">{{ stats.total }}</div>
        </div>
        
        <div class="stat-card card">
          <h3>Open</h3>
          <div class="stat-number" style="color: #10B981">
            {{ stats.open }}
          </div>
        </div>
        
        <div class="stat-card card">
          <h3>In Progress</h3>
          <div class="stat-number" style="color: #F59E0B">
            {{ stats.inProgress }}
          </div>
        </div>
        
        <div class="stat-card card">
          <h3>Closed</h3>
          <div class="stat-number" style="color: #6B7280">
            {{ stats.closed }}
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <router-link to="/tickets" class="btn btn-primary">
          Manage Tickets
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTicketsStore } from '../stores/tickets'

export default {
  name: 'DashboardPage',
  setup() {
    const authStore = useAuthStore()
    const ticketsStore = useTicketsStore()
    const router = useRouter()

    const stats = ref({
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0
    })

    const loading = ref(true)

    const loadStats = async () => {
      try {
        const statsData = await ticketsStore.fetchStats()
        stats.value = statsData
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        loading.value = false
      }
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }

    onMounted(() => {
      loadStats()
    })

    return {
      stats,
      loading,
      handleLogout
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  padding: 2rem 0;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-card h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
}

.dashboard-actions {
  text-align: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.25rem;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
}
</style>