const DB_KEY = 'ticketapp_database';

const initialDB = {
  tickets: [],
  users: []
};

export const databaseService = {
  init: () => {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
    }
  },

  getDB: () => {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : initialDB;
  },

  saveDB: (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  getCollection: (collectionName) => {
    const db = databaseService.getDB();
    return db[collectionName] || [];
  },

  saveCollection: (collectionName, data) => {
    const db = databaseService.getDB();
    db[collectionName] = data;
    databaseService.saveDB(db);
  },

  getNextId: (collectionName) => {
    const collection = databaseService.getCollection(collectionName);
    if (collection.length === 0) return 1;
    return Math.max(...collection.map(item => item.id)) + 1;
  },

  getUserTickets: (userId) => {
    const tickets = databaseService.getCollection('tickets');
    return tickets.filter(ticket => ticket.userId === userId);
  },

  getUserStats: (userId) => {
    const userTickets = databaseService.getUserTickets(userId);
    const total = userTickets.length;
    const open = userTickets.filter(t => t.status === 'open').length;
    const inProgress = userTickets.filter(t => t.status === 'in_progress').length;
    const closed = userTickets.filter(t => t.status === 'closed').length;

    return { total, open, inProgress, closed };
  }
};

databaseService.init();