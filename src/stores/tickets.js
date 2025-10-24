import { defineStore } from 'pinia';
import { ticketService } from '../services/tickets';

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    loading: false,
    error: null
  }),

  getters: {
    getTicketById: (state) => (id) => {
      return state.tickets.find(ticket => ticket.id === parseInt(id));
    }
  },

  actions: {
    async fetchTickets() {
      this.loading = true;
      this.error = null;
      try {
        this.tickets = await ticketService.getTickets();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createTicket(ticketData) {
      try {
        const newTicket = await ticketService.createTicket(ticketData);
        this.tickets.push(newTicket);
        return { success: true, ticket: newTicket };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async updateTicket(id, ticketData) {
      try {
        const updatedTicket = await ticketService.updateTicket(id, ticketData);
        const index = this.tickets.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
          this.tickets[index] = updatedTicket;
        }
        return { success: true, ticket: updatedTicket };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async deleteTicket(id) {
      try {
        await ticketService.deleteTicket(id);
        this.tickets = this.tickets.filter(t => t.id !== parseInt(id));
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async fetchStats() {
      try {
        return await ticketService.getStats();
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
});