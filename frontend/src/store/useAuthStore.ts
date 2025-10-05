import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Restaurant } from '@/types';

interface AuthState {
  authenticatedRestaurant: Restaurant | null;
  login: (restaurant: Restaurant) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authenticatedRestaurant: null,
      login: (restaurant) => set({ authenticatedRestaurant: restaurant }),
      logout: () => set({ authenticatedRestaurant: null }),
      isAuthenticated: () => get().authenticatedRestaurant !== null,
    }),
    {
      name: 'restaurant-auth-storage',
      partialize: (state) => ({ authenticatedRestaurant: state.authenticatedRestaurant }),
    }
  )
);
