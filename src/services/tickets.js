import { SESSION_KEY } from '../utils/constants';
import { databaseService } from './database';

const getCurrentUserId = () => {
  const token = localStorage.getItem(SESSION_KEY);
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token));
    return payload.id;
  } catch {
    return null;
  }
};

export const ticketService = {
  getTickets: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        if (!userId) {
          reject(new Error('Unauthorized'));
          return;
        }

        const userTickets = databaseService.getUserTickets(userId);
        resolve([...userTickets]);
      }, 500);
    });
  },

  getTicket: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        if (!userId) {
          reject(new Error('Unauthorized'));
          return;
        }

        const userTickets = databaseService.getUserTickets(userId);
        const ticket = userTickets.find(t => t.id === parseInt(id));
        
        if (ticket) {
          resolve(ticket);
        } else {
          reject(new Error('Ticket not found'));
        }
      }, 300);
    });
  },

  createTicket: async (ticketData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        if (!userId) {
          reject(new Error('Unauthorized'));
          return;
        }

        const tickets = databaseService.getCollection('tickets');
        const newTicket = {
          id: databaseService.getNextId('tickets'),
          ...ticketData,
          userId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedTickets = [...tickets, newTicket];
        databaseService.saveCollection('tickets', updatedTickets);
        
        resolve(newTicket);
      }, 500);
    });
  },

  updateTicket: async (id, ticketData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        if (!userId) {
          reject(new Error('Unauthorized'));
          return;
        }

        const tickets = databaseService.getCollection('tickets');
        const index = tickets.findIndex(t => t.id === parseInt(id) && t.userId === userId);
        
        if (index !== -1) {
          const updatedTicket = {
            ...tickets[index],
            ...ticketData,
            updatedAt: new Date().toISOString()
          };

          const updatedTickets = [...tickets];
          updatedTickets[index] = updatedTicket;
          databaseService.saveCollection('tickets', updatedTickets);
          
          resolve(updatedTicket);
        } else {
          reject(new Error('Ticket not found or access denied'));
        }
      }, 500);
    });
  },

  deleteTicket: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        if (!userId) {
          reject(new Error('Unauthorized'));
          return;
        }

        const tickets = databaseService.getCollection('tickets');
        const index = tickets.findIndex(t => t.id === parseInt(id) && t.userId === userId);
        
        if (index !== -1) {
          const updatedTickets = tickets.filter(t => t.id !== parseInt(id));
          databaseService.saveCollection('tickets', updatedTickets);
          
          resolve(true);
        } else {
          reject(new Error('Ticket not found or access denied'));
        }
      }, 500);
    });
  },

  getStats: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        if (!userId) {
          reject(new Error('Unauthorized'));
          return;
        }

        const stats = databaseService.getUserStats(userId);
        resolve(stats);
      }, 300);
    });
  }
};