import { defineStore } from 'pinia';
import { authService } from '../services/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),

  actions: {
    async login(credentials) {
      try {
        const { user } = await authService.login(credentials.email, credentials.password);
        this.user = user;
        this.isAuthenticated = true;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async signup(userData) {
      try {
        const { user } = await authService.signup(userData);
        this.user = user;
        this.isAuthenticated = true;
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    logout() {
      authService.logout();
      this.user = null;
      this.isAuthenticated = false;
    },

    checkAuth() {
      const user = authService.getCurrentUser();
      if (user) {
        this.user = user;
        this.isAuthenticated = true;
      }
    }
  }
});